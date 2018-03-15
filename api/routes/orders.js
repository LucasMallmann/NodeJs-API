const express = require('express');
const router = express.Router();

// GEt
router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'GET orders'
    });
});

// Post
router.post('/', (req, res, next) => {
    var order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    };
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