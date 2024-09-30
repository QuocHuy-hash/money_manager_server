const express = require('express');

const router = express.Router();

router.use('/api/', require('./user/index'));
router.use('/api/', require('./bankAccount/index'));
router.use('/api/', require('./casso/index'));
router.use('/api/', require('./transaction/index'));
router.use('/api/', require('./fixedExpenses/index'));

module.exports = router;