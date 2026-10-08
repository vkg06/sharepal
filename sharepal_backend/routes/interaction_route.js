const express = require('express');
const router = express.Router();
const controller = require('../controllers/interaction_controller');
const rentalController = require('../controllers/rental_controller');

router.post('/pricing/quote', rentalController.quote);
router.get('/orders', rentalController.getOrders);

router.get('/wishlist', controller.getWishlist);
router.post('/wishlist/:id/toggle', controller.toggleWishlist);
router.post('/products/:id/notify', controller.notify);
router.post('/products/:id/vote', controller.vote);
router.post('/products/:id/rent', controller.rent);

module.exports = router;
