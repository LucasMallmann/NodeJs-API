const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

const checkAuth  = require('../middleware/check-auth');

//import Controller
const OrdersController = require('../controllers/orders');

// Get
// Não execute a função. Apenas a referência
router.get('/', checkAuth, OrdersController.orders_get_all); 

// Post
router.post('/', OrdersController.saveNewOrder);

// GEt com id 
router.get('/:orderId', OrdersController.getSpecificOrder);

router.patch('/:orderId', (req, res, next) => {
    res.status(200).json({
        messsage: 'Order updated',
        id: req.params.orderId
    });
});

router.delete('/:orderId', (req, res, next) => {
		var id = req.params.orderId;
		Order.remove({_id: id})
			.exec()
			.then(result => {
        res.status(200).json({
        message: 'Order deleted',
          request: {
            type: 'POST',
            description: 'You can create a new order here',
            url: 'http://localhost:3000/orders/',
            body: { productId: 'ID', quantity:'Number' }
          }
				});
			})
			.catch(err => {
				res.status(500).json({
					error: err
				});
			});
});


module.exports = router;