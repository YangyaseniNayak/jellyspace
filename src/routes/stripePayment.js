const express = require('express');
const router = express.Router();
const paymentController = require('../controller/payment.controller');

// Define routes
router.get('/', paymentController.stripePayment);       // Will match '/stripe/'
router.post('/payment', paymentController.payment);     // Will match '/stripe/payment'

module.exports = router;