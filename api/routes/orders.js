const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');


// GEt
router.get('/', (req, res, next) => {
    Order.find({})
        //selecionando o que eu quero retornar
        .select('product quantity _id')
				
				// selecionando o produto para aparecer aqui nesse get tbm
				// meio que fazer um merge
				.populate('product', 'name')
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
    // // checar para ver se existe o id do produto que ele quer salvar o pedido
    // Product.findById(req.body.productId)
    //     .then(product => {
    //         if(!product){
    //             return res.status(404).json({
    //                 message: 'Product Not Found'
    //             });
    //         }

    //         const order = new Order({
    //             _id: mongoose.Types.ObjectId(),
    //             quantity: req.body.quantity,
    //             product: req.body.productId
    //         });
    //         return order
    //             .save() // retorna uma promessa
    //     })
    //     .then(result => {
    //         res.status(201).json({
    //             message: 'Order stored',
    //             createdProduct: {
    //                 _id: result._id,
    //                 product: result.product,
    //                 quantity: result.quantity
    //             },
    //             request: {
    //                 type: 'GET',
    //                 url:'http://localhost:3000/orders/' + result._id
    //             }
    //         });
    //     })
    //     .catch(err => {
    //         res.status(500).json({
    //             error: err
    //         });
    //     });    


    //     // res.status(201).json({
    // //     message: 'Order was created',
    // //     order: order
    // // });
    // console.log(order)
		Product.findById(req.body.productId)
    .then(product => {
      if (!product) {
        return res.status(404).json({
          message: "Product not found"
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
      });
      return order.save();
		})
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Order stored",
        createdOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/orders/" + result._id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// GEt com id 
router.get('/:orderId', (req, res, next) => {
	Order.findById(req.params.orderId)
		.select('quantity _id product')
		.populate('product', 'name price')
		.exec()
		.then(order => {
				if(!order){
					res.status(404).json({
						message: "Order Not Found"
					});
				}
				res.status(200).json({
					order: order,
					request: {
						type: 'GET',
						url: 'http://localhost:3000/orders'
					}
				});
		})
		.catch(function(err){
			res.status(500).json({
				error: err
			});
		})
});

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
				// console.log(result);
				// if(!order){
				// 	res.status(404).json({
				// 		message: 'Product not Found'
				// 	});
				// }

				// res.status(200).json({
				// 	message: 'Order deleted',
				// 	request: {
				// 		type: 'POST',
				// 		description: 'You can create a new order here',
				// 		url: 'http://localhost:3000/orders/',
				// 		body: { productId: 'ID', quantity:'Number' }
				// 	}
				// });

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