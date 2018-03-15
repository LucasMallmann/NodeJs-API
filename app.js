const express = require('express');
const app = express();
// Lib to log requests
const morgan = require('morgan');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

app.use(morgan('dev'));

// Tudo o que começar com '/products' deve ser redirecionado para o arquivo ./api/routes/products
// Routes that handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// This line will be reached if no route was found
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;
