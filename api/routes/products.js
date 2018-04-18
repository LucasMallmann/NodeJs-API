const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');

const multer = require('multer');
const checkAuth  = require('../middleware/check-auth');

// config about how the file will be stored
const storage = multer.diskStorage({
	
	// where the file will be stored
	destination: function(req, file, cb){
		cb(null, './uploads/');
	},

	// how the file will be named
	filename: function(req, file, cb){
		cb(null, new Date().toISOString() + file.originalname);
	}

});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png'){
            cb(null, true);
        }
    else{
        cb(null, true);
    }
}

const upload = multer({
	storage: storage, // my storage strategy...how i'm gonna store the image
	limits: {
		fileSize: 1024 * 1024 * 5 // accept only 5mb File
    },
    fileFilter: fileFilter // my configuration variable
});

// configurar a rota.
// Isso é como se fosse uma subrota, que irá acionar quando bater /products
// GET all products
router.get('/', (req, res, next) => {
    Product.find()
        .select('name price productImage _id') // select fields that will return
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
                        productImage: individualResult.productImage,
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
// Vou chamar o meu middleware para checar e validar o Token, o checkAuth
router.post('/', upload.single('productImage'), checkAuth, (req, res, next) => {
    console.log(req.file);
    var product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path // store the path of the file
    });

    // save to database
    product
    .save()
    .then((result) => {
        console.log('----------------------------------------');
        console.log(result);
        console.log('----------------------------------------');
        res.status(201).json({
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                productImage: result.productImage, 

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
        .select('name price productImage _id')
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