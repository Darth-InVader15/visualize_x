import ShopifyCustomer from "../schema/customerSchema.js"
import shopifyOrders from "../schema/orderSchema.js";

const formatChartData = (data, labelFunc, dataFunc) => ({
    labels: data.map(labelFunc),
    datasets: [{
        label: 'Data',
        data: data.map(dataFunc),
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Change this to your preferred color
        borderColor: 'rgba(75, 192, 192, 1)', // Change this to your preferred color
        borderWidth: 1
    }]
});

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
export const dailyRepeatCustomers = async (req, res) => {
    try {
        const repeatedCustomers = await shopifyOrders.aggregate([
            {
                $addFields: {
                    convertedDate: { $toDate: "$created_at" }
                }
            },
            {
                $group: {
                    _id: {
                        customerId: "$customer.id",
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$convertedDate" } }
                    },
                    orderCount: { $sum: 1 }
                }
            },
            {
                // Optional: Filter customers with more than one order per day
                $match: {
                    orderCount: { $gt: 1 }
                }
            },
            {
                $group: {
                    _id: "$_id.date",
                    totalRepeatedCustomers: { $sum: 1 }
                }
            },
            
            
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    totalRepeatedCustomers: 1
                }
            },
            {
                $sort: { 'date': 1 }
            }
        ]);
        const chartData = formatChartData(repeatedCustomers, data => data.date, data => data.totalRepeatedCustomers);
        res.json(chartData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


export const monthlyRepeatCustomers = async (req, res) => {
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
            {
                $group: {
                    _id: {
                        month: "$_id.month",
                        year: "$_id.year"
                    },
                    repeatCustomerCount: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 }
            }
        ]);
        const chartData = formatChartData(repeatCustomers, data => `${data._id.month}-${data._id.year}`, data => data.repeatCustomerCount);
        res.json(chartData);
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
            {
                $group: {
                    _id: "$_id.year",
                    repeatCustomerCount: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    year: "$_id",
                    repeatCustomerCount: 1
                }
            },
            { $sort: { 'year': 1 } }
        ]);
        const chartData = formatChartData(repeatCustomers, data => `${data.year}`, data => data.repeatCustomerCount);
        res.json(chartData);
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
            {
                $group: {
                    _id: {
                        year: "$_id.year",
                        quarter: "$_id.quarter"
                    },
                    repeatCustomerCount: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    year: "$_id.year",
                    quarter: "$_id.quarter",
                    repeatCustomerCount: 1
                }
            },
            { $sort: { 'year': 1, 'quarter': 1 } }
        ]);
        const chartData = formatChartData(repeatCustomers, data => `Q${data.quarter} ${data.year}`, data => data.repeatCustomerCount);
        res.json(chartData);
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

export const customerLifetimeValueByCohorts = async (req, res) => {
    try {
        const clvByCohorts = await shopifyOrders.aggregate([
            // Convert created_at to a date object
            {
                $addFields: {
                    convertedDate: { $toDate: "$created_at" },
                    totalPriceNumber: { $toDouble: "$total_price_set.shop_money.amount" }
                }
            },
            // Group by customer ID and calculate first purchase month and year
            {
                $group: {
                    _id: "$customer.id",
                    firstPurchaseDate: { $min: "$convertedDate" },
                    lifetimeValue: { $sum: "$totalPriceNumber" }
                }
            },
            // Project the cohort and lifetime value
            {
                $project: {
                    _id: 0,
                    customerId: "$_id",
                    cohort: { 
                        year: { $year: "$firstPurchaseDate" },
                        month: { $month: "$firstPurchaseDate" }
                    },
                    lifetimeValue: 1
                }
            },
            // Group by cohort to sum the lifetime values
            {
                $group: {
                    _id: "$cohort",
                    totalLifetimeValue: { $sum: "$lifetimeValue" },
                    numberOfCustomers: { $sum: 1 }
                }
            },
            // Sort by cohort (optional)
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            },
            // Project final output
            {
                $project: {
                    _id: 0,
                    cohort: {
                        $concat: [
                            { $toString: "$_id.year" }, "-",
                            { $toString: { $substr: ["$_id.month", 0, 2] } }
                        ]
                    },
                    totalLifetimeValue: 1,
                    numberOfCustomers: 1,
                    avgLifetimeValue: { $divide: ["$totalLifetimeValue", "$numberOfCustomers"] }
                }
            }
        ]);

        res.json(clvByCohorts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};