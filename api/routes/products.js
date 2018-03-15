const express = require('express');
const router = express.Router();

// configurar a rota.
// Isso é como se fosse uma subrota, que irá acionar quando bater /products
router.get('/', (req, res, next) => {
    res.status(200).json({
        messsage: "Handling GET requests to /products"
    });
});

// Rota para Post
router.post('/', function(req, res, next){
    var product = {
        name: req.body.name,
        price: req.body.price
    };
    res.status(201).json({
        messsage: "Handling POST requests to /products",
        createdProduct: product
    });
    console.log(product);
});

// Route to get by Id
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    // Return a special id
    if (id === 'special') {
        res.status(200).json({
            messsage: 'You have discovere a special Id ;D',
            id: id
        });
    }
    else{
        res.status(200).json({
            messsage: 'You passed an id but it is not special'
        });
    }
});

router.patch('/:productId', (req, res, next) => {
    res.status(200).json({
        messsage: 'Updated product'
    });
});

router.delete('/:productId', function(req, res, next) {
    res.status(200).json({
        messsage: 'Product deleted'
    });
});


module.exports = router;