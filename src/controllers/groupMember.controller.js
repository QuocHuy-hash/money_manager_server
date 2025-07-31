'use strict'

const { SuccessResponse, CreatedResponse } = require("../core/success.response");
const GroupService = require("../services/groupFamily.service");

const HEADER = {
    CLIENT_ID: 'x-client-id',
};

class GroupController {
    
    userId = null;
    
    setUserId(req) {
        this.userId = req.headers[HEADER.CLIENT_ID];
    }
    
    // Create a new group
    createGroup = async (req, res, next) => {
        this.setUserId(req);
        new CreatedResponse({
            message: 'Create Group Success',
            metadata: await GroupService.createGroup(this.userId, req.body),
        }).send(res)
    }
    
    // Update group details
    updateGroup = async (req, res, next) => {
        this.setUserId(req);
        const { groupId, ...data } = req.body;
        new SuccessResponse({
            message: 'Update Group Success',
            metadata: await GroupService.updateGroup(this.userId, groupId, data),
        }).send(res)
    }
    
    // Get all groups of the user
    getUserGroups = async (req, res, next) => {
        this.setUserId(req);
        new SuccessResponse({
            message: 'Get User Groups Success',
            metadata: await GroupService.getUserGroups(this.userId),
        }).send(res)
    }
     getGroupsSummaries = async (req, res, next) => {
        this.setUserId(req);
        new SuccessResponse({
            message: 'Get Group Summaries Success',
            metadata: await GroupService.getGroupSummaries(this.userId),
        }).send(res)
    }
    // Get a group by ID
    getGroupById = async (req, res, next) => {
        this.setUserId(req);
        const groupId = req.query.groupId;
        new SuccessResponse({
            message: 'Get Group Success',
            metadata: await GroupService.getGroupById(this.userId, groupId),
        }).send(res)
    }
    
    // Delete a group
    deleteGroup = async (req, res, next) => {
        this.setUserId(req);
        const groupId = req.body.groupId;
        new SuccessResponse({
            message: 'Delete Group Success',
            metadata: await GroupService.deleteGroup(this.userId, groupId),
        }).send(res)
    }
    
    // Invite a user to join a group
    inviteUser = async (req, res, next) => {
        this.setUserId(req);
        const { groupId, ...inviteData } = req.body;
        new SuccessResponse({
            message: 'User Invitation Sent Success',
            metadata: await GroupService.inviteUser(this.userId, groupId, inviteData.data),
        }).send(res)
    }
    
    // Respond to an invitation
    respondToInvitation = async (req, res, next) => {
        this.setUserId(req);
        const { invitationId, accept } = req.body;
        new SuccessResponse({
            message: accept ? 'Invitation Accepted Success' : 'Invitation Rejected',
            metadata: await GroupService.respondToInvitation(this.userId, invitationId, accept),
        }).send(res)
    }
    
    // Get pending invitations
    getPendingInvitations = async (req, res, next) => {
        this.setUserId(req);
        new SuccessResponse({
            message: 'Get Pending Invitations Success',
            metadata: await GroupService.getPendingInvitations(this.userId),
        }).send(res)
    }
    
    // Remove a member from group
    removeMember = async (req, res, next) => {
        this.setUserId(req);
        const { groupId, memberId } = req.body;
        new SuccessResponse({
            message: 'Member Removed Success',
            metadata: await GroupService.removeMember(this.userId, groupId, memberId),
        }).send(res)
    }
    
    // Get group members
    getGroupMembers = async (req, res, next) => {
        this.setUserId(req);
        const groupId = req.query.groupId;
        new SuccessResponse({
            message: 'Get Group Members Success',
            metadata: await GroupService.getGroupMembers(this.userId, groupId),
        }).send(res)
    }
    
    // Get group transactions
    getGroupTransactions = async (req, res, next) => {
        this.setUserId(req);
        const groupId = req.query.groupId;
        new SuccessResponse({
            message: 'Get Group Transactions Success',
            metadata: await GroupService.getGroupTransactions(this.userId, groupId),
        }).send(res)
    }
    
    // Add a transaction to group
    addGroupTransaction = async (req, res, next) => {
        this.setUserId(req);
        const { groupId, ...data } = req.body;
        new CreatedResponse({
            message: 'Add Group Transaction Success',
            metadata: await GroupService.addGroupTransaction(this.userId, groupId, data.transactionData),
        }).send(res)
    }
    
    // Update a group transaction
    updateGroupTransaction = async (req, res, next) => {
        this.setUserId(req);
        const { groupId, transactionId, ...data } = req.body;
        new SuccessResponse({
            message: 'Update Group Transaction Success',
            metadata: await GroupService.updateGroupTransaction(this.userId, groupId, transactionId, data.transactionData),
        }).send(res)
    }
    
    // Delete a group transaction
    deleteGroupTransaction = async (req, res, next) => {
        this.setUserId(req);
        const { groupId, transactionId } = req.body;
        new SuccessResponse({
            message: 'Delete Group Transaction Success',
            metadata: await GroupService.deleteGroupTransaction(this.userId, groupId, transactionId),
        }).send(res)
    }
    
    // Get group fixed expenses
    getGroupFixedExpenses = async (req, res, next) => {
        this.setUserId(req);
        const groupId = req.query.groupId;
        new SuccessResponse({
            message: 'Get Group Fixed Expenses Success',
            metadata: await GroupService.getGroupFixedExpenses(this.userId, groupId),
        }).send(res)
    }
    
    // Add a fixed expense to group
    addGroupFixedExpense = async (req, res, next) => {
        this.setUserId(req);
        const { groupId, ...fixedExpenseData } = req.body;
        new CreatedResponse({
            message: 'Add Group Fixed Expense Success',
            metadata: await GroupService.addGroupFixedExpense(this.userId, groupId, fixedExpenseData),
        }).send(res)
    }
    
    // Update a group fixed expense
    updateGroupFixedExpense = async (req, res, next) => {
        this.setUserId(req);
        const { groupId, fixedExpenseId, ...fixedExpenseData } = req.body;
        new SuccessResponse({
            message: 'Update Group Fixed Expense Success',
            metadata: await GroupService.updateGroupFixedExpense(this.userId, groupId, fixedExpenseId, fixedExpenseData),
        }).send(res)
    }
    
    // Delete a group fixed expense
    deleteGroupFixedExpense = async (req, res, next) => {
        this.setUserId(req);
        const { groupId, fixedExpenseId } = req.body;
        new SuccessResponse({
            message: 'Delete Group Fixed Expense Success',
            metadata: await GroupService.deleteGroupFixedExpense(this.userId, groupId, fixedExpenseId),
        }).send(res)
    }
    
    // Update member permissions
    updateMemberPermissions = async (req, res, next) => {
        this.setUserId(req);
        const { groupId, memberId, permissions, role } = req.body;
        new SuccessResponse({
            message: 'Update Member Permissions Success',
            metadata: await GroupService.updateMemberPermissions(this.userId, groupId, memberId, permissions, role),
        }).send(res)
    }
    
    // Leave a group
    leaveGroup = async (req, res, next) => {
        this.setUserId(req);
        const { groupId } = req.body;
        new SuccessResponse({
            message: 'Leave Group Success',
            metadata: await GroupService.leaveGroup(this.userId, groupId),
        }).send(res)
    }
    
    // Transfer group ownership
    transferOwnership = async (req, res, next) => {
        this.setUserId(req);
        const { groupId, newOwnerId } = req.body;
        new SuccessResponse({
            message: 'Transfer Ownership Success',
            metadata: await GroupService.transferOwnership(this.userId, groupId, newOwnerId),
        }).send(res)
    }
}

module.exports = new GroupController();