const express = require('express');

const router = express.Router();

router.use('/api/', require('./user/index'));
router.use('/api/', require('./casso/index'));
router.use('/api/', require('./transaction/index'));
router.use('/api/', require('./fixedExpenses/index'));
router.use('/api/', require('./goals/index'));
router.use('/api/', require('./report/index'));
router.use('/api/', require('./upload/index'));
router.use('/api/', require('./spendingLimit/index'));
router.use('/api/', require('./groupMembers/index'));

module.exports = router;