const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const Order = require('../models/order');

// GEt
router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'GET orders'
    });
});

// Post
router.post('/', (req, res, next) => {
    const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.param.quantity,
        product: req.body.productId
    });
    order.save().exec().then()

    res.status(201).json({
        message: 'Order was created',
        order: order
    });
    console.log(order)
});

// GEt com id 
router.get('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Order details',
        id: req.params.orderId
    });
});

router.patch('/:orderId', (req, res, next) => {
    res.status(200).json({
        messsage: 'Order updated',
        id: req.params.orderId
    });
});

router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Order deleted',
        id: req.params.orderId
    });
});


module.exports = router;