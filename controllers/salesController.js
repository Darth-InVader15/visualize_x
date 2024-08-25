import shopifyOrders from "../schema/orderSchema.js";

const formatChartData = (sales, labelFunc) => ({
    labels: sales.map(labelFunc),
    datasets: [{
        label: 'Sales',
        data: sales.map(sale => sale.totalSales),
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Change this to your preferred color
        borderColor: 'rgba(75, 192, 192, 1)', // Change this to your preferred color
        borderWidth: 1
    }]
});
const formatOrderChartData = (orders, labelFunc) => ({
    labels: orders.map(labelFunc),
    datasets: [{
        label: 'Orders',
        data: orders.map(sale => sale.totalQuantity),
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Change this to your preferred color
        borderColor: 'rgba(75, 192, 192, 1)', // Change this to your preferred color
        borderWidth: 1
    }]
});


//the names are self explanatory
export const totSalesDaily = async (req, res) => {
    try {
        const sales = await shopifyOrders.aggregate([
            {
                $addFields: {
                    convertedDate: { $toDate: "$created_at" },
                    totalPriceNumber: { $toDouble: "$total_price_set.shop_money.amount" }
                }
            },
            {
                $group: {
                    _id: { 
                        day: { $dayOfMonth: "$convertedDate" }, 
                        month: { $month: "$convertedDate" }, 
                        year: { $year: "$convertedDate" } 
                    },
                    totalSales: { $sum: "$totalPriceNumber" }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
        ]);

        const chartData = formatChartData(sales, sale => `${sale._id.day}/${sale._id.month}/${sale._id.year}`);
        res.json(chartData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
export const totSalesMonthly = async(req,res) => {
    try {
        const sales = await shopifyOrders.aggregate([
            {
                $addFields: {
                    convertedDate: { $toDate: "$created_at" },
                    totalPriceNumber: { $toDouble: "$total_price_set.shop_money.amount" }
                }
            },
            {
                $group: {
                    _id: { 
                        // day: { $dayOfMonth: "$convertedDate" }, 
                        month: { $month: "$convertedDate" }, 
                        year: { $year: "$convertedDate" } 
                    },
                    totalSales: { $sum: "$totalPriceNumber" }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        const chartData = formatChartData(sales, sale => `${sale._id.month}/${sale._id.year}`);
        res.json(chartData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

export const totSalesQuartely = async (req, res) => {
    try {
        const sales = await shopifyOrders.aggregate([
            {
                $addFields: {
                    convertedDate: { $toDate: "$created_at" },
                    totalPriceNumber: { $toDouble: "$total_price_set.shop_money.amount" }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$convertedDate" },
                        quarter: { 
                            $ceil: {
                                $divide: [{ $month: "$convertedDate" }, 3]
                            }
                        }
                    },
                    totalSales: { $sum: "$totalPriceNumber" }
                }
            },
            { $sort: { '_id.year': 1, '_id.quarter': 1 } }
        ]);
        
        const chartData = formatChartData(sales, sale => `${sale._id.quarter}/${sale._id.year}`);
        res.json(chartData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const totSalesYearly = async(req,res) => {
    try {
        const sales = await shopifyOrders.aggregate([
            {
                $addFields: {
                    convertedDate: { $toDate: "$created_at" },
                    totalPriceNumber: { $toDouble: "$total_price_set.shop_money.amount" }
                }
            },
            {
                $group: {
                    _id: { 
                        // day: { $dayOfMonth: "$convertedDate" }, 
                        // month: { $month: "$convertedDate" }, 
                        year: { $year: "$convertedDate" } 
                    },
                    totalSales: { $sum: "$totalPriceNumber" }
                }
            },
            { $sort: { '_id.year': 1 } }
        ]);

        const chartData = formatChartData(sales, sale => `${sale._id.year}`);
        res.json(chartData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

export const orderCountYearly = async(req,res) => {
    try{
        const sales = await shopifyOrders.aggregate([
            {
                $addFields: {
                    convertedDate: { $toDate: "$created_at" },
                    totalQuantity: 1
                }
            },
            {
                $group: {
                    _id: { year: { $year: "$convertedDate" } },
                    totalQuantity: { $sum: "$totalQuantity" }
                }
            },
            { $sort: { '_id.year': 1 } } //total orders per year
        ]);
    
        const chartData = formatOrderChartData(sales, sale => `${sale._id.year}`);
        res.json(chartData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

export const orderCountMonthly = async(req,res) => {
    try{
        const sales = await shopifyOrders.aggregate([
            {
                $addFields: {
                    convertedDate: { $toDate: "$created_at" },
                    totalQuantity: 1
                }
            },
            {
                $group: {
                    _id: { 
                        month: { $month: "$convertedDate" } ,
                    year: { 
                        $year: "$convertedDate" 
                    }
                },
                    totalQuantity: { $sum: "$totalQuantity" }
                }},
            { $sort: { '_id.year': 1, '_id.month':1 } } //total orders per year
        ]);
    
        const chartData = formatOrderChartData(sales, sale => `${sale._id.month}/${sale._id.year}`);
        res.json(chartData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}