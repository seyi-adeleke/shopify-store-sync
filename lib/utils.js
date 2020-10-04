const updateProductQuantity = async (client, data) => {
    const products = await client.getProducts();
    let inventory_item_id;

    products.find(item => {
        for (let i =0; i < item.variants.length; i++) {
            if (item.variants[i].sku === data.sku) {
                inventory_item_id = item.variants[i].inventory_item_id;
                return item;
            }
        }
    });

    let payload = {};

    data.quantity ?
        payload = {
            "inventory_item_id": inventory_item_id,
            "location_id": data.location_id,
            "available": data.quantity,
        }:
        payload = {
            "inventory_item_id": inventory_item_id,
            "location_id": data.location_id,
            "available_adjustment" : -1,
        }

    const updateProduct = data.quantity ?
        await client.setProductInventory(payload):
        await client.updateProductInventory(payload)

    return updateProduct;
}


const getLocations = async (client) => {
    const locations = await client.getLocations();
    return locations;
}

module.exports = {
    updateProductQuantity,
    getLocations,
}