const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');

// configurar a rota.
// Isso é como se fosse uma subrota, que irá acionar quando bater /products
// GET all products
router.get('/', (req, res, next) => {
    Product.find()
        .exec()
        .then(result => {
            console.log("From DB" + result)
            // Check if it returns any data
            if (result.length >= 0) {
                res.status(200).json(result);
            }
            else{
                res.status(404).json({
                    'message': 'No entries found',
                    result: result
                });
            }
        })
        .catch((err) => {
            res.status(500).json({
                error: err
            });
        });
    // res.status(200).json({
    //     mensagem: 'Sucesso no GET!'
    // });
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
            console.log(result);
			res.status(201).json({
				messsage: "Handling POST requests to /products",
				createdProduct: result
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
        .exec()
        .then(result => {
            console.log("From Database" + result);

			if(result){
				res.status(200).json(result);
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
        res.status(200).json(result);
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
          res.status(200).json(result);
      })
      .catch(err => {
          res.status(500).json({
            error: err
          });
      });
});


module.exports = router;