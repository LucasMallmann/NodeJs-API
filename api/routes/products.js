const express = require('express');
const router = express.Router();

// configurar a rota.
// Isso é como se fosse uma sobrota, que irá acionar quando bater /products
router.get('/', (req, res, next) => {
    res.status(200).json({
        messsage: 'Handling GET requests to /products'
    });
});

router.post('/', function(req, res, next){
    res.status(200).json({
        messsage: "Handling POST requests to /products"
    });
});


module.exports = router;