const express = require('express');
const app = express();

const productRoutes = require('./api/routes/products');

// Tudo o que começar com '/products' deve ser redirecionado para o arquivo ./api/routes/products
app.use('/products', productRoutes);

module.exports = app;
