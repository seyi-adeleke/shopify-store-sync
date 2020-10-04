const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const Shopify = require('./lib/shopify');
const emitter = require('./lib/Events');


const app = express();
const middlewares = [bodyParser.urlencoded({ extended: true }), bodyParser.json()];

const crispStore3 = new Shopify('crisp-dev3', process.env.CRISP_3_API_KEY, process.env.CRISP_3_PASSWORD);
const crispStore4 = new Shopify('crisp-dev4', process.env.CRISP_4_API_KEY, process.env.CRISP_4_PASSWORD);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.use(middlewares);

app.get('/3/products', async (req, res) => {
    const products = await crispStore3.getProducts();
    return res.json(products);
});

app.get('/3/orders', async (req, res) => {
    const orders = await crispStore3.getOrders();
    return res.json(orders);
});

app.post('/3/orders', async (req, res) => {
    const order = await crispStore3.createOrder(req.body.variant_id);
    emitter.emit('update_store_4_product', req.body.sku);
    return res.json(order);
});

app.get('/4/products', async (req, res) => {
    const products = await crispStore4.getProducts();
    return res.json(products);
});

app.get('/4/orders', async (req, res) => {
    const orders = await crispStore4.getOrders();
    return res.json(orders);
});

app.post('/4/orders', async (req, res) => {
    const orders = await crispStore4.createOrder(req.body.variant_id);
    emitter.emit('update_store_3_product', req.body.sku);
    return res.json(orders);
});

app.post('/3/update-product', async (req, res) => {
   const productVariants = req.body.variants;
   productVariants.forEach(variant => {
        emitter.emit('update_store_4_product', variant.sku, variant.inventory_quantity);
   });
   res.sendStatus(200);
});

app.post('/4/update-product', async (req, res) => {
    const productVariants = req.body.variants;
    productVariants.forEach(variant => {
         emitter.emit('update_store_3_product', variant.sku, variant.inventory_quantity);
    });
    res.sendStatus(200);
});


const listener = app.listen(3000, function() {
  console.log('Your app is listening on port ' + 3000);
});
