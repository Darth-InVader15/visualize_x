import mongoose from 'mongoose';

const shopifyCustomerSchema = new mongoose.Schema({
    created_at: String
}, { collection: 'shopifyCustomers' });

const shopifyCustomer = mongoose.model('shopifyCustomers', shopifyCustomerSchema);

export default shopifyCustomer;