const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const Order = require('../models/order');

// GEt
router.get('/', (req, res, next) => {
    Order.find({})
        //selecionando o que eu quero retornar
        .select('product quantity _id')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return{
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type:'GET',
                            url:'http://localhost:3000/orders/' + doc._id
                        }
                    }  
                }),
                // request: {
                //     type:'GET',
                //     url:'http://localhost:3000/orders/' + req.params.productId
                // }
            });
        })
        .catch(function(err){
            res.status(500).json({
                error: err
            });
        });
});

// Post
router.post('/', (req, res, next) => {
    const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
    });
    order
        .save()
        // .exec()
        .then(result => {
            res.status(201).json({
                message: 'Order stored',
                createdProduct: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: 'GET',
                    url:'http://localhost:3000/orders/' + result._id
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    // res.status(201).json({
    //     message: 'Order was created',
    //     order: order
    // });
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