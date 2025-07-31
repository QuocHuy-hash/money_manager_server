const express = require('express');
const router = express.Router();

const { asyncHandle } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtil');
const groupMemberController = require('../../controllers/groupMember.controller');

// Authentication middleware - requires login for all routes
router.use(authentication);

// Group management routes
router.post('/group/create', asyncHandle(groupMemberController.createGroup));
router.post('/group/update', asyncHandle(groupMemberController.updateGroup));
router.get('/group/user-groups', asyncHandle(groupMemberController.getUserGroups));
router.get('/group/get-by-id', asyncHandle(groupMemberController.getGroupById));
router.get('/group/get-summaries', asyncHandle(groupMemberController.getGroupsSummaries));
router.post('/group/delete', asyncHandle(groupMemberController.deleteGroup)); //chưa test

// Group member management
router.post('/group/invite', asyncHandle(groupMemberController.inviteUser));
router.post('/group/respond-invitation', asyncHandle(groupMemberController.respondToInvitation));
router.get('/group/pending-invitations', asyncHandle(groupMemberController.getPendingInvitations));
router.post('/group/remove-member', asyncHandle(groupMemberController.removeMember));
router.get('/group/members', asyncHandle(groupMemberController.getGroupMembers));
router.post('/group/update-permissions', asyncHandle(groupMemberController.updateMemberPermissions));
router.post('/group/leave', asyncHandle(groupMemberController.leaveGroup));
router.post('/group/transfer-ownership', asyncHandle(groupMemberController.transferOwnership));

// Group transactions
router.post('/group/transaction/add', asyncHandle(groupMemberController.addGroupTransaction));
router.get('/group/transactions', asyncHandle(groupMemberController.getGroupTransactions));
router.post('/group/transaction/update', asyncHandle(groupMemberController.updateGroupTransaction));
router.post('/group/transaction/delete', asyncHandle(groupMemberController.deleteGroupTransaction));

// Group fixed expenses
router.get('/group/fixed-expenses', asyncHandle(groupMemberController.getGroupFixedExpenses));
router.post('/group/fixed-expense/add', asyncHandle(groupMemberController.addGroupFixedExpense));
router.post('/group/fixed-expense/update', asyncHandle(groupMemberController.updateGroupFixedExpense));
router.post('/group/fixed-expense/delete', asyncHandle(groupMemberController.deleteGroupFixedExpense));

module.exports = router;