import ShopifyCustomer from "../schema/customerSchema.js"

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