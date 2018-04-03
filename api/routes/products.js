const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');

// configurar a rota.
// Isso é como se fosse uma subrota, que irá acionar quando bater /products
// GET all products
router.get('/', (req, res, next) => {
    Product.find()
        .select('name price _id') // select fields that will return
        .exec()
        .then(result => {

            // variavel que será retornada para o json
            var response = {
                count: result.length,

                //fazendo um map da resposta antiga para a nova
                products: result.map(individualResult => {
                    return {
                        name: individualResult.name,
                        price: individualResult.price,
                        _id: individualResult._id,

                        // Metadados
                        // Como obter uma informação mais detalhada sobre determinado produto
                        request_detail: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + individualResult._id
                        }
                    }
                })
            };

            res.status(200).json(response);
        })
        .catch((err) => {
            res.status(500).json({
                error: err
            });
        });
});

// Rota para Post
router.post('/', function(req, res, next){

    var product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    // save to database
    product
        .save()
        .then((result) => {
            // console.log(result);
			res.status(201).json({
				createdProduct: {
                    name: res.name,
                    price: res.price,
                    _id: res._id,

                    request:{
                        type: 'GET',
                        description: 'Detailed Description about the product you just created :)',
                        url: 'http://localhost:3000/products/' + res._id
                    }
                }
			});
        })
        .catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			});
		});
    console.log(product);
});

// Route to get by Id
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id')
        .exec()
        .then(result => {

			if(result){
				res.status(200).json({
                    product: result,
                    request: {
                        type: 'GET',
                        description: 'Get All the Products',
                        url: 'http://localhost:3000/products'
                    }
                });
			}else{
				res.status(404).json({
					messsage: "No valid entry found for provided Id"
				});
			}

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

});

// Update a product
router.patch('/:productId', (req, res, next) => {
    var id = req.params.productId;
    // Store the things that you want to update
    var updateOps = {};

    // iterate over the ops
    for(var ops of req.body){
        updateOps[ops.propName] = ops.value;
    }


    Product.update({_id: id}, {$set: updateOps})
      .exec()
      .then(result => {
        console.log(result);
        res.status(200).json({
            messsage: 'Product Updated',

            request: {
                type: 'GET',
                description: 'Detailed information about the updated product',
                url: 'http://localhost:3000/products/' + id
            }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
      })
});

// Delete a product using the id
router.delete('/:productId', function(req, res, next) {
    var id = req.params.productId;
    Product.remove({_id: id})
      .exec()
      .then(result => {
          console.log("Product Deleted from DB " + result);
          res.status(200).json({
              messsage: 'Product Deleted',
              request: {
                  type: 'POST',
                  description: 'You can create a new product here',
                  url: 'http://localhost:3000/products/',
                  data: { name:'String', price:'Number' }
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