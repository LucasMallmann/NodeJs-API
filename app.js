const express = require('express');
const app = express();
// Lib to log requests
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

app.use(morgan('dev'));

// The bodyParser is to parsing POST requests.
//  It can parse entire forms into the request body
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// Handle the CORS (Cross Origin Resource Sharing) errors. 
// The CORS errors are the ones that don't allow you to 
// Access the API server if you are in another server or port.
// E.g: If I'm on port 4000 and the server is on port 3000 I can't access it. 
// app.use((res, req, next) => {
//     // Allow everybody
//     res.header('Access-Control-Allow-Origin', '*');
//     // Define what headers we want to accept
//     res.header(
//         'Access-Control-Allow-Headers', 
//         'Origin, X-Requested-With, Content-Type, Accept, Authorization'
//     );
//     if (req.method === 'OPTIONS') {
//         res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
//         return res.status(200).json();
//     }
// });


// Tudo o que começar com '/products' deve ser redirecionado para o arquivo ./api/routes/products
// Routes that handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// // Connect to Mongoose
// mongoose.connect(
//     "mongodb://node-shop:"+
//     process.env.MONGO_ATLAS_PW + 
//     "@node-rest-shop-shard-00-00-hicel.mongodb.net:27017,node-rest-shop-shard-00-01-hicel.mongodb.net:27017,node-rest-shop-shard-00-02-hicel.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-shop-shard-0&authSource=admin"
//     // {
//     //     useMongoClient: true
//     // }
// );

mongoose.connect('mongodb://localhost/shop');


// This line will be reached if no route was found
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

// Handle every error in the application,
// returning a Json object with the error message
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;
