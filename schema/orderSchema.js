import mongoose from "mongoose";

// const MoneySetSchema = new mongoose.Schema({
//     amount: String,
//     currency_code: String
// }, { _id: false });

const OrderSchema = new mongoose.Schema({
    created_at: String,
    total_price_set: {
        shop_money: {
            amount: String,
            currency_code: String
        }
    },
    customer: {
        email: String
    }
}, { collection: 'shopifyOrders' });

const shopifyOrders = mongoose.model('shopifyOrders', OrderSchema);

export default shopifyOrders;
