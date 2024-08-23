import shopifyOrders from "../schema/orderSchema.js";

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

        res.json(sales);
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

        res.json(sales);
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
        
        res.json(sales);
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

        res.json(sales);
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
    
        res.json(sales);
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
    
        res.json(sales);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}