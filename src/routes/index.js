const express = require('express');

const router = express.Router();

router.use('/api/', require('./user/index'));
router.use('/api/', require('./bankAccount/index'));

module.exports = router;