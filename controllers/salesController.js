import shopifyOrders from "../schema/orderSchema.js";
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
    //the code below is just to check whether the DB is replying or not
    try {
        const orders = await shopifyOrders.find({});
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

export const totSalesQuartely = async(req,res) => {
    res.send("Quarter");
}

export const totSalesYearly = async(req,res) => {
    res.send("Annual");
}