const router = require('express').Router();
const { authenticated, isInRoles } = require('../configs/security');

// Account route
router.use('/account', require('./account'));
// Equipment route
// Room route
router.use('/job', authenticated, isInRoles(['admin']), require('./job'));
// Booking route
router.use('/apply', authenticated, require('./apply'));

module.exports = router;