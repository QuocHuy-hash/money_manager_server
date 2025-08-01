const { Op } = require('sequelize');
const { BadRequestError, NotFoundError, ForbiddenError } = require('../core/error.response');
const { Group, GroupMember, User, Transaction, Category, FixedExpense, sequelize } = require('../models');
const { sendMail, sendEmail } = require('./sendMailer/send.mail.service');
const emailQueue = require('../workers/email.worker');
const { checkMemberFamily, checkMembership, checkPremiumUser, checkGroupLimit, getTransactionWithPermission } = require('../models/repositoris/groupFamily.repo');

const ROLES = {
    OWNER: 'owner',
    ADMIN: 'admin',
    MEMBER: 'member'
};

const DEFAULT_PERMISSIONS = {
    view_transactions: true,
    add_transactions: false,
    edit_transactions: false,
    delete_transactions: false,
    view_budgets: true,
    edit_budgets: false
};
/**
 * Chức năng quản lý giao dịch nhóm:

getGroupTransactions: Lấy danh sách giao dịch của nhóm
addGroupTransaction: Thêm giao dịch mới vào nhóm
updateGroupTransaction: Cập nhật giao dịch trong nhóm
deleteGroupTransaction: Xóa giao dịch khỏi nhóm


Chức năng quản lý chi phí cố định:

getGroupFixedExpenses: Lấy danh sách chi phí cố định của nhóm
addGroupFixedExpense: Thêm chi phí cố định mới vào nhóm
updateGroupFixedExpense: Cập nhật chi phí cố định trong nhóm
deleteGroupFixedExpense: Xóa chi phí cố định khỏi nhóm


Chức năng quản lý thành viên và quyền:

updateMemberPermissions: Cập nhật quyền và vai trò của thành viên trong nhóm
leaveGroup: Rời khỏi nhóm
transferOwnership: Chuyển quyền sở hữu nhóm cho thành viên khác
 */
class GroupService {

    // Create a new family/group
    static async createGroup(userId, data) {
        try {
            // Check if user is premium
           await checkPremiumUser(userId);
            await checkGroupLimit(userId);
            // Create the group
            const group = await Group.create({
                name: data.name,
                description: data.description || '',
                owner_id: userId,
                is_premium: true,
                max_members: data.max_members || 5
            });

            // Add the creator as owner
            await GroupMember.create({
                user_id: userId,
                group_id: group.id,
                role: 'owner',
                permissions: data.permissions || DEFAULT_PERMISSIONS,
                invitation_status: 'accepted',
                joined_at: new Date()
            });

            return group;
        } catch (error) {
            throw new BadRequestError(`Error creating group: ${error.message}`);
        }
    }

    // Update group details
    static async updateGroup(userId, groupId, data) {
        try {
            const group = await Group.findOne({
                where: {
                    id: groupId,
                    owner_id: userId
                }
            });

            if (!group) {
                throw new NotFoundError('Group not found or you are not the owner');
            }

            await group.update({
                name: data.name || group.name,
                description: data.description || group.description,
                max_members: data.max_members || group.max_members
            });

            return group;
        } catch (error) {
            throw new BadRequestError(`Error updating group: ${error.message}`);
        }
    }

    // Get all groups a user belongs to
    static async getUserGroups(userId) {
        const memberships = await GroupMember.findAll({
            where: { user_id: userId, invitation_status: 'accepted' },
            attributes: ['role', 'permissions'],
            include: [{
                model: Group,
                as: 'group',
                attributes: ['id', 'name', 'description', 'max_members'],
                include: [{
                    model: User,
                    as: 'owner',
                    attributes: ['id', 'email']
                }]
            }]
        });

        return memberships.map(m => ({
            ...m.group.toJSON(),
            role: m.role,
            permissions: m.permissions
        }));
    }

    // Get a specific group by ID
    static async getGroupById(userId, groupId) {
        try {
            // Check if user is a member of this group
            const membership = await checkMemberFamily(userId, groupId);

            if (!membership) {
                throw new NotFoundError('Group not found or you are not a member');
            }

            // Get group with member details
            const group = await Group.findByPk(groupId, {
                include: [
                    { model: User, as: 'owner', attributes: ['id', 'firstName', 'lastName', 'email'] },
                    { model: GroupMember, as: 'GroupMembers', include: [{ model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] }] }
                ]
            });

            return {
                ...group.toJSON(),
                userRole: membership.role,
                userPermissions: membership.permissions
            };
        } catch (error) {
            throw new BadRequestError(`Error fetching group: ${error.message}`);
        }
    }

    // Delete a group
    static async deleteGroup(userId, groupId) {
        try {
            const group = await Group.findOne({
                where: {
                    id: groupId,
                    owner_id: userId
                }
            });

            if (!group) {
                throw new NotFoundError('Group not found or you are not the owner');
            }

            await sequelize.transaction(async (t) => {
                await GroupMember.destroy({ where: { group_id: groupId }, transaction: t });
                await group.destroy({ transaction: t });
            });

            return { message: 'Group deleted successfully' };
        } catch (error) {
            throw new BadRequestError(`Error deleting group: ${error.message}`);
        }
    }

    // Invite a user to join a group
    static async inviteUser(userId, groupId, data) {

        try {
            // Check if user is owner or admin of this group
            const membership = await GroupMember.findOne({
                where: {
                    user_id: userId,
                    group_id: groupId,
                    role: {
                        [Op.in]: ['owner', 'admin']
                    },
                    invitation_status: 'accepted'
                }
            });

            if (!membership) {
                throw new ForbiddenError('You do not have permission to invite users to this group');
            }

            // Check if group has reached maximum members
            const group = await Group.findByPk(groupId);
            const currentMembers = await GroupMember.count({
                where: {
                    group_id: groupId,
                    invitation_status: 'accepted'
                }
            });

            if (currentMembers >= group.max_members) {
                throw new BadRequestError('This group has reached its maximum number of members');
            }
            // Check if invitee exists
            const invitee = await User.findOne({
                where: {
                    email: data.email
                }
            });

            if (!invitee) {
                throw new NotFoundError('User not found');
            }

            // Check if already a member or invited
            const existingMembership = await GroupMember.findOne({
                where: {
                    user_id: invitee.id,
                    group_id: groupId
                }
            });
            if (existingMembership) {
                if (existingMembership.invitation_status === 'accepted') {
                    throw new BadRequestError('User is already a member of this group');
                } else if (existingMembership.invitation_status === 'pending') {
                    throw new BadRequestError('User has already been invited to this group');
                } else {
                    // If previously rejected, update to pending
                    await existingMembership.update({
                        invitation_status: 'pending'
                    });

                    // Send invitation email
                    await this._sendInvitationEmail(group, invitee);


                    return { message: 'Invitation sent successfully' };
                }
            }

            // Create new membership with pending status
            await GroupMember.create({
                user_id: invitee.id,
                group_id: groupId,
                role: data.role || 'member',
                permissions: data.permissions || {
                    view_transactions: true,
                    add_transactions: false,
                    edit_transactions: false,
                    delete_transactions: false,
                    view_budgets: true,
                    edit_budgets: false
                },
                invitation_status: 'pending'
            });

            // Send invitation email
            await this._sendInvitationEmail(group, invitee);
            return { message: 'Invitation sent successfully' };
        } catch (error) {
            throw new BadRequestError(`Error inviting user: ${error.message}`);
        }
    }
    // Accept or reject an invitation
    static async respondToInvitation(userId, invitationId, accept) {
        try {
            const invitation = await GroupMember.findOne({
                where: {
                    id: invitationId,
                    user_id: userId,
                    invitation_status: 'pending'
                },
                include: [{
                    model: Group,
                    as: 'group'
                }]
            });

            if (!invitation) {
                throw new NotFoundError('Invitation not found');
            }

            if (accept) {
                await invitation.update({
                    invitation_status: 'accepted',
                    joined_at: new Date()
                });
                return { message: 'Invitation accepted successfully' };
            } else {
                await invitation.update({
                    invitation_status: 'rejected'
                });
                return { message: 'Invitation rejected' };
            }
        } catch (error) {
            throw new BadRequestError(`Error responding to invitation: ${error.message}`);
        }
    }

    // Get pending invitations for a user
    static async getPendingInvitations(userId) {
        try {
            return await GroupMember.findAll({
                where: {
                    user_id: userId,
                    invitation_status: 'pending'
                },
                include: [{
                    model: Group,
                    as: 'group',
                    include: [{
                        model: User,
                        as: 'owner',
                        attributes: ['id', 'firstName', 'lastName', 'email']
                    }]
                }]
            });
        } catch (error) {
            throw new BadRequestError(`Error fetching pending invitations: ${error.message}`);
        }
    }

    // Remove a member from a group
    static async removeMember(userId, groupId, memberId) {
        try {
            // Check if user is owner or admin of this group
            const membership = await GroupMember.findOne({
                where:
                {
                    user_id: userId,
                    group_id: groupId,
                    role: {
                        [Op.in]: ['owner', 'admin']
                    },
                    invitation_status: 'accepted'
                }
            });
            if (!membership) {
                throw new NotFoundError('You do not have permission to remove members from this group');
            }
            // Check if member exists in this group
            const member = await GroupMember.findOne({
                where: {
                    id: memberId,
                    group_id: groupId
                }
            });
            if (!member) {
                throw new NotFoundError('Member not found in this group');
            }
            // Remove member from group
            await member.destroy();
            return { message: 'Member removed successfully' };
        }
        catch (error) {
            throw new BadRequestError(`Error removing member: ${error.message}`);
        }
    }
    // Send invitation email
    static async _sendInvitationEmail(group, invitee) {
        const job = await emailQueue.add(
            'group-invitation', // tên job
            {
                to: invitee.email,
                groupName: group.name,
                invitee
            },
            {
                attempts: 3, // thử lại 3 lần nếu thất bại
                backoff: 5000 // đợi 5 giây trước khi thử lại
            }
        );

        // Ghi lại ID của công việc để theo dõi sau này
        return {
            message: 'Invitation sent successfully',
            jobId: job.id // trả về ID công việc
        };
    }
    // Get group members
    static async getGroupMembers(userId, groupId) {
        try {
            const group = await Group.findByPk(groupId);
            if (!group) {
                throw new NotFoundError('Group not found');
            }

            const members = await GroupMember.findAll({
                where: {
                    group_id: groupId,
                    invitation_status: 'accepted'
                },
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['id', 'firstName', 'lastName', 'email']
                }]
            });

            return members.map(member => member.user);
        } catch (error) {
            throw new BadRequestError(`Error fetching group members: ${error.message}`);
        }
    }

    // Get group transactions
    static async getGroupTransactions(userId, groupId) {
        // Check if user is a member of this group
        await checkMembership(userId, groupId, ['view_transactions']);

        const transactions = await Transaction.findAll({
            where: { group_id: groupId },
            attributes: ['id', 'amount', 'title', 'description', 'transaction_date', 'createdAt'],
            include: [
                { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] },
                { model: Category, as: 'category', attributes: ['id', 'name'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        return transactions;
    }

    // Add a transaction to a group
    static async addGroupTransaction(userId, groupId, transactionData) {
        await checkMembership(userId, groupId, ['add_transactions']);

        const transaction = await Transaction.create({
            ...transactionData,
            user_id: userId,
            group_id: groupId
        });

        return transaction;
    }

    // Update a transaction in a group
    static async updateGroupTransaction(userId, groupId, transactionId, transactionData) {
       const transaction = await getTransactionWithPermission(userId, groupId, transactionId, 'edit_transactions');
        await transaction.update(transactionData);
        return transaction;
    }

    // Delete a transaction from a group
    static async deleteGroupTransaction(userId, groupId, transactionId) {
       const transaction = await getTransactionWithPermission(userId, groupId, transactionId, 'delete_transactions');
        await transaction.destroy();
        return { message: 'Transaction deleted successfully' };
    }

    // Get group fixed expenses
    static async getGroupFixedExpenses(userId, groupId) {
        try {
            // Check if user is a member of this group
            const membership = await checkMemberFamily(userId, groupId);

            if (!membership) {
                throw new NotFoundError('Group not found or you are not a member');
            }

            // Check if user has permission to view budgets (which includes fixed expenses)
            if (!membership.permissions.view_budgets) {
                throw new ForbiddenError('You do not have permission to view fixed expenses in this group');
            }

            const fixedExpenses = await FixedExpense.findAll({
                where: {
                    group_id: groupId
                },
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['id', 'firstName', 'lastName', 'email']
                }, {
                    model: Category,
                    as: 'category'
                }],
                order: [['next_payment_date', 'ASC']]
            });

            return fixedExpenses;
        } catch (error) {
            throw new BadRequestError(`Error fetching group fixed expenses: ${error.message}`);
        }
    }

    // Add a fixed expense to a group
    static async addGroupFixedExpense(userId, groupId, fixedExpenseData) {
        try {
            // Check if user is a member of this group
            const membership = await checkMemberFamily(userId, groupId);

            if (!membership) {
                throw new NotFoundError('Group not found or you are not a member');
            }

            // Check if user has permission to edit budgets (which includes adding fixed expenses)
            if (!membership.permissions.edit_budgets) {
                throw new ForbiddenError('You do not have permission to add fixed expenses to this group');
            }

            // Create new fixed expense associated with the group
            const fixedExpense = await FixedExpense.create({
                ...fixedExpenseData,
                user_id: userId,
                group_id: groupId
            });

            return fixedExpense;
        } catch (error) {
            throw new BadRequestError(`Error adding group fixed expense: ${error.message}`);
        }
    }

    // Update a fixed expense in a group
    static async updateGroupFixedExpense(userId, groupId, fixedExpenseId, fixedExpenseData) {
        try {
            // Check if user is a member of this group
            const membership = await checkMemberFamily(userId, groupId);

            if (!membership) {
                throw new NotFoundError('Group not found or you are not a member');
            }

            // Find the fixed expense
            const fixedExpense = await FixedExpense.findOne({
                where: {
                    id: fixedExpenseId,
                    group_id: groupId
                }
            });

            if (!fixedExpense) {
                throw new NotFoundError('Fixed expense not found');
            }

            // Check if user has permission to edit budgets (which includes fixed expenses)
            if (!membership.permissions.edit_budgets && fixedExpense.user_id !== userId) {
                throw new ForbiddenError('You do not have permission to edit this fixed expense');
            }

            // Update fixed expense
            await fixedExpense.update(fixedExpenseData);

            return fixedExpense;
        } catch (error) {
            throw new BadRequestError(`Error updating group fixed expense: ${error.message}`);
        }
    }

    // Delete a fixed expense from a group
    static async deleteGroupFixedExpense(userId, groupId, fixedExpenseId) {
        try {
            // Check if user is a member of this group
            const membership = await checkMemberFamily(userId, groupId);

            if (!membership) {
                throw new NotFoundError('Group not found or you are not a member');
            }

            // Find the fixed expense
            const fixedExpense = await FixedExpense.findOne({
                where: {
                    id: fixedExpenseId,
                    group_id: groupId
                }
            });

            if (!fixedExpense) {
                throw new NotFoundError('Fixed expense not found');
            }

            // Check if user has permission to edit budgets (which includes deleting fixed expenses)
            if (!membership.permissions.edit_budgets && fixedExpense.user_id !== userId) {
                throw new ForbiddenError('You do not have permission to delete this fixed expense');
            }

            // Delete fixed expense
            await fixedExpense.destroy();

            return { message: 'Fixed expense deleted successfully' };
        } catch (error) {
            throw new BadRequestError(`Error deleting group fixed expense: ${error.message}`);
        }
    }

    // Update member permissions
    static async updateMemberPermissions(userId, groupId, memberId, newPermissions, newRole) {
        try {
            // Check if user is owner or admin of this group
            const userMembership = await GroupMember.findOne({
                where: {
                    user_id: userId,
                    group_id: groupId,
                    role: {
                        [Op.in]: ['owner', 'admin']
                    },
                    invitation_status: 'accepted'
                }
            });

            if (!userMembership) {
                throw new ForbiddenError('You do not have permission to update member permissions');
            }

            // Find the target member
            const targetMember = await GroupMember.findOne({
                where: {
                    id: memberId,
                    group_id: groupId
                },
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['id', 'full_name', 'firstName', 'lastName', 'email']

                }]
            });

            if (!targetMember) {
                throw new NotFoundError('Member not found');
            }

            // Owner can edit anyone, admin can only edit regular members
            if (userMembership.role === 'admin' && targetMember.role !== 'member') {
                throw new ForbiddenError('Admins can only update permissions of regular members');
            }

            // Cannot change the owner's role
            const group = await Group.findByPk(groupId);
            if (targetMember.user_id === group.owner_id && newRole && newRole !== 'owner') {
                throw new ForbiddenError('Cannot change the role of the group owner');
            }

            // Update permissions and/or role
            const updateData = {};
            if (newPermissions) {
                updateData.permissions = {
                    ...targetMember.permissions,
                    ...newPermissions
                };
            }

            if (newRole && userMembership.role === 'owner') {
                updateData.role = newRole;
            }

            await targetMember.update(updateData);

            return targetMember;
        } catch (error) {
            throw new BadRequestError(`Error updating member permissions: ${error.message}`);
        }
    }

    // Leave a group
    static async leaveGroup(userId, groupId) {
        try {
            // Find the group
            const group = await Group.findByPk(groupId);
            if (!group) {
                throw new NotFoundError('Group not found');
            }

            // Find the membership
            const membership = await checkMemberFamily(userId, groupId);

            if (!membership) {
                throw new NotFoundError('You are not a member of this group');
            }

            // Cannot leave if you're the owner
            if (group.owner_id === userId) {
                throw new ForbiddenError('As the owner, you cannot leave the group. Transfer ownership first or delete the group.');
            }

            // Remove member from group
            await membership.destroy();

            return { message: 'Successfully left the group' };
        } catch (error) {
            throw new BadRequestError(`Error leaving group: ${error.message}`);
        }
    }

    // Transfer group ownership
    static async transferOwnership(userId, groupId, newOwnerId) {
        try {
            // Find the group
            const group = await Group.findOne({
                where: {
                    id: groupId,
                    owner_id: userId
                }
            });

            if (!group) {
                throw new NotFoundError('Group not found or you are not the owner');
            }

            // Find the new owner's membership
            const newOwnerMembership = await GroupMember.findOne({
                where: {
                    user_id: newOwnerId,
                    group_id: groupId,
                    invitation_status: 'accepted'
                }
            });

            if (!newOwnerMembership) {
                throw new NotFoundError('New owner is not a member of this group');
            }

            // Update group owner
            await group.update({
                owner_id: newOwnerId
            });

            // Update current owner's role to admin
            const currentOwnerMembership = await GroupMember.findOne({
                where: {
                    user_id: userId,
                    group_id: groupId
                }
            });

            await currentOwnerMembership.update({
                role: 'admin'
            });

            // Update new owner's role to owner
            await newOwnerMembership.update({
                role: 'owner',
                permissions: {
                    view_transactions: true,
                    add_transactions: true,
                    edit_transactions: true,
                    delete_transactions: true,
                    view_budgets: true,
                    edit_budgets: true
                }
            });

            return { message: 'Ownership transferred successfully' };
        } catch (error) {
            throw new BadRequestError(`Error transferring ownership: ${error.message}`);
        }
    }
// Get summaries of all groups that a user is a member of
static async getGroupSummaries(userId) {
    try {
        // Check if user is premium
        await checkPremiumUser(userId);
        
        // Get all group memberships for this user
        const memberships = await GroupMember.findAll({
            where: { 
                user_id: userId, 
                invitation_status: 'accepted' 
            },
            include: [{
                model: Group,
                as: 'group',
                attributes: ['id', 'name', 'description']
            }]
        });
        
        if (!memberships.length) {
            return [];
        }
        
        // Get current month date range
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        // Process each group
        const groupSummaries = await Promise.all(memberships.map(async (membership) => {
            const groupId = membership.group.id;
            
            // Get members
            const members = await GroupMember.findAll({
                where: {
                    group_id: groupId,
                    invitation_status: 'accepted'
                },
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['id', 'firstName', 'lastName']
                }]
            });
            console.log("firstDayOfMonth", firstDayOfMonth);
            console.log("lastDayOfMonth", lastDayOfMonth);
            // Get transactions for current month
            const transactions = await Transaction.findAll({
                where: {
                    group_id: groupId,
                    transaction_date: {
                        [Op.between]: [firstDayOfMonth, lastDayOfMonth]
                    }
                },
                attributes: ['amount', 'transaction_type'] // Include transaction_type attribute
            });
            console.log("transactions", transactions);
            // Separate transactions into income and expenses
            const incomeTransactions = transactions.filter(transaction => transaction.transaction_type == 'Thu nhập');
            const expenseTransactions = transactions.filter(transaction => transaction.transaction_type == 'Chi tiêu');
            
            const totalIncome = incomeTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
            const totalExpenses = expenseTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
            
            return {
                group_id: membership.group.id,
                group_name: membership.group.name,
                current_month_income: totalIncome,
                current_month_expenses: totalExpenses,
                members: members.map(member => ({
                    id: member.user.id,
                    firstName: member.user.firstName,
                    lastName: member.user.lastName,
                    role: member.role
                }))
            };
        }));
        
        return groupSummaries;
    } catch (error) {
        throw new BadRequestError(`Error fetching group summaries: ${error.message}`);
    }
}

}

module.exports = GroupService;