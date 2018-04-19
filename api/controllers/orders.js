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