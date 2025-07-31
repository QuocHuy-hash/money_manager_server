'use strict'

const { NotFoundError, ForbiddenError } = require("../../core/error.response");
const { GroupMember,User,Group,Transaction } = require("../../models");

const checkMemberFamily = async ( userId,groupId ) => {
    console.log("groupId", groupId);
            const membership = await GroupMember.findOne({
                where: {
                    user_id: userId,
                    group_id: groupId,
                    invitation_status: 'accepted'
                }
            });
    return membership ;
}

const checkMembership = async (userId, groupId, requiredPermissions = []) => {
    const membership = await GroupMember.findOne({
        where: {
            user_id: userId,
            group_id: groupId,
            invitation_status: 'accepted'
        }
    });
    if (!membership) {
        throw new NotFoundError('Group not found or you are not a member');
    }
    for (const permission of requiredPermissions) {
        if (!membership.permissions[permission]) {
            throw new ForbiddenError(`You do not have permission to ${permission}`);
        }
    }
    return membership;
};
const checkPremiumUser = async (userId) => {
    const user = await User.findByPk(userId);
    if (!user) throw new NotFoundError('User not found');
    if (!user.is_premium) throw new ForbiddenError('Group/Family sharing is a premium feature');
    return user;
};

const checkGroupLimit = async (userId) => {
    const userGroups = await Group.count({ where: { owner_id: userId } });
    if (userGroups >= 3) throw new BadRequestError('Maximum number of groups reached');
};
const getTransactionWithPermission = async (userId, groupId, transactionId, permission) => {
    const membership = await checkMembership(userId, groupId, [permission]);
    const transaction = await Transaction.findOne({
        where: { id: transactionId, group_id: groupId }
    });
    if (!transaction) throw new NotFoundError('Transaction not found');
    if (transaction.user_id !== userId && !membership.permissions[permission]) {
        throw new ForbiddenError(`You do not have permission to ${permission} this transaction`);
    }
    return transaction;
};
module.exports = { checkMemberFamily,checkMembership,checkPremiumUser,checkGroupLimit,getTransactionWithPermission };