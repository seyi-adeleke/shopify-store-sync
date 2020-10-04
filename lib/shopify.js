const Shopify = require('shopify-api-node');

class ShopifyClass {
    constructor(name, apiKey, password) {
        this.name = name;
        this.apiKey = apiKey;
        this.password = password;
    }

    client() {
        return new Shopify({
            shopName: this.name,
            apiKey: this.apiKey,
            password: this.password
        })
    }

    /**
     * Fetch a list of products
     */
    async getProducts() {
        const products = await this.client().product
            .list()
            .then((product) => (product))
            .catch((err) => console.error(err));
        return products;
    }

    /**
     * Return a list of orders
     */
    async getOrders() {
        const orders = await this.client().order.list().then((order) => (order))
        .catch((err) => console.log(err));

        return orders;
    }

    /**
     * Create a new order
     * @param {string} variant_id
     */
    async createOrder(variant_id) {
        const orders = await this.client().order.create({
            "line_items": [{
                "variant_id": variant_id,
                "quantity": 1
            }],
            "fulfillment_status": "fulfilled",
            "inventory_behaviour": "decrement_obeying_policy"
        }).then((order) => (order))
        .catch((err) => console.log(err));

        return orders;
    }

    /**
     * update a product inventory
     * @param {object} payload
     */
    async updateProductInventory(payload) {
        const update = await this.client().inventoryLevel
                                .adjust(payload)
                                .then((update) => (update))
                                .catch((err) => console.log(err));
        return update;
    }

    /**
     * set a products inventory level
     * @param {*} payload
     */
    async setProductInventory(payload) {
        const update = await this.client().inventoryLevel
            .set(payload)
            .then((update) => (update))
            .catch((err) => console.log(err));

        return update;
    }

    /**
     * Return a list of locations
     */
    async getLocations() {
        const locations = await this.client().location.list()
            .then(location => location)
            .catch((err) => console.log(err));

        return locations
    }
}

module.exports = ShopifyClass;