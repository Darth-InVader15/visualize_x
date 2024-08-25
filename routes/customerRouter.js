import express from "express"
import { YearlyRepeatCustomers, dailyRepeatCustomers, monthlyCust, monthlyRepeatCustomers, quarterlyRepeatCustomers, yearlyCust } from "../controllers/customerController.js";
const router = express.Router();

// router.use('/', (req,res) =>{
//     res.send("Work in progress");
//     console.log("Customer router is working");
// })
router.use('/new-customers/month', monthlyCust);
router.use('/new-customers/year', yearlyCust);
router.use('/repeat-customers/daily', dailyRepeatCustomers);
router.use('/repeat-customers/monthly', monthlyRepeatCustomers);
router.use('/repeat-customers/0.25', quarterlyRepeatCustomers);
router.use('/repeat-customers/yearly', YearlyRepeatCustomers);


export default router;