const router = require('express').Router();
const ctrl = require('../controllers/paymentController');

router.post('/create', ctrl.create);

module.exports = router;