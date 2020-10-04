const EventEmitter = require('events');

const utils = require('./utils');
const Shopify = require('./shopify');

const crispStore3 = new Shopify('crisp-dev3', process.env.CRISP_3_API_KEY, process.env.CRISP_3_PASSWORD);
const crispStore4 = new Shopify('crisp-dev4', process.env.CRISP_4_API_KEY, process.env.CRISP_4_PASSWORD);

class MyEmitter extends EventEmitter {}
const emitter = new MyEmitter();

emitter.on('update_store_4_product', async (sku, quantity) => {
    const locationID = await utils.getLocations(crispStore4);
    const data = {
        sku,
        location_id: locationID[0].id,
        quantity: quantity ? quantity : null
    }
    utils.updateProductQuantity(crispStore4, data);
});

emitter.on('update_store_3_product', async (sku, quantity) => {
    const locationID = await utils.getLocations(crispStore3);
    const data = {
        sku,
        location_id: locationID[0].id,
        quantity: quantity ? quantity : null
    }
    utils.updateProductQuantity(crispStore3, data);
});

module.exports = emitter;