import ShopifyCustomer from "../schema/customerSchema.js"
import shopifyOrders from "../schema/orderSchema.js";

export const monthlyCust = async (req, res) => {
    try {
        const customers = await ShopifyCustomer.aggregate([
            {
                $addFields: {
                    convertedDate: { $toDate: "$created_at" }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$convertedDate" },
                        month: { $month: "$convertedDate" }
                    },
                    totalCustomers: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 }
            },
            {
                $project: {
                    _id: 0,
                    year: '$_id.year',
                    month: '$_id.month',
                    totalCustomers: 1
                }
            }
        ]);

        // Format data for Chart.js
        const labels = customers.map(data => `${data.month}-${data.year}`);
        const dataPoints = customers.map(data => data.totalCustomers);

        res.json({ labels, dataPoints });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
export const yearlyCust = async (req, res) => {
    try {
        const customers = await ShopifyCustomer.aggregate([
            {
                $addFields: {
                    convertedDate: { $toDate: "$created_at" }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$convertedDate" }
                    },
                    totalCustomers: { $sum: 1 } // Counting each customer
                }
            },
            { $sort: { '_id.year': 1 } }
        ]);
        res.json(customers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
export const dailyRepeatCustomers = async(req, res) => {
    try {
        const repeatCustomers = await shopifyOrders.aggregate([
            {
                $addFields: {
                    convertedDate: { $toDate: "$created_at" }
                }
            },
            {
                $group: {
                    _id: {
                        day: { $dayOfMonth: "$convertedDate" },
                        month: { $month: "$convertedDate" },
                        year: { $year: "$convertedDate" },
                        email: "$customer.email"
                    },
                    orderCount: { $sum: 1 }
                }
            },
            {
                $match: {
                    orderCount: { $gt: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
        ]);
        res.json(repeatCustomers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
export const monthlyRepeatCustomers = async(req, res) => {
    try {
        const repeatCustomers = await shopifyOrders.aggregate([
            {
                $addFields: {
                    convertedDate: { $toDate: "$created_at" }
                }
            },
            {
                $group: {
                    _id: {
                        // day: { $dayOfMonth: "$convertedDate" },
                        month: { $month: "$convertedDate" },
                        year: { $year: "$convertedDate" },
                        email: "$customer.email"
                    },
                    orderCount: { $sum: 1 }
                }
            },
            {
                $match: {
                    orderCount: { $gt: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);
        res.json(repeatCustomers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
export const YearlyRepeatCustomers = async(req, res) => {
    try {
        const repeatCustomers = await shopifyOrders.aggregate([
            {
                $addFields: {
                    convertedDate: { $toDate: "$created_at" }
                }
            },
            {
                $group: {
                    _id: {
                        // day: { $dayOfMonth: "$convertedDate" },
                        // month: { $month: "$convertedDate" },
                        year: { $year: "$convertedDate" },
                        email: "$customer.email"
                    },
                    orderCount: { $sum: 1 }
                }
            },
            {
                $match: {
                    orderCount: { $gt: 1 }
                }
            },
            { $sort: { '_id.year': 1 } }
        ]);
        res.json(repeatCustomers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
export const quarterlyRepeatCustomers = async(req, res) => {
    try {
        const repeatCustomers = await shopifyOrders.aggregate([
            {
                $addFields: {
                    convertedDate: { $toDate: "$created_at" }
                }
            },
            {
                $group: {
                    _id: {
                        quarter: { $ceil: { $divide: [{ $month: "$convertedDate" }, 3] } },
                        year: { $year: "$convertedDate" },
                        email: "$email"
                    },
                    orderCount: { $sum: 1 }
                }
            },
            {
                $match: {
                    orderCount: { $gt: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.quarter': 1 } }
        ]);
        res.json(repeatCustomers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
export const customerGeographicalDistribution = async (req, res) => {
    try {
        const customers = await ShopifyCustomer.aggregate([
            {
                $match: {
                    "default_address.city": { $ne: null }
                }
            },
            {
                $group: {
                    _id: "$default_address.city",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    city: "$_id",
                    count: 1
                }
            }
        ]);

        res.json(customers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};