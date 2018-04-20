const Order = require('../models/order');

exports.orders_get_all = (req, res, next) => {
    Order.find({})
        //selecionando o que eu quero retornar
        .select('product quantity _id')
				
				// selecionando o produto para aparecer aqui nesse get tbm
				// meio que fazer um merge com a outra collection
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
}

exports.saveNewOrder = (req, res, next) => {
    // Verifica se já não existe um pedido com esse Id
    Product.findById(req.body.productId)
    .then(product => {
      if (!product) {
        return res.status(404).json({
          message: "Product not found"
        });
      }
      
      // Criando um novo produto
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
}

exports.getSpecificOrder = (req, res, next) => {
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
}