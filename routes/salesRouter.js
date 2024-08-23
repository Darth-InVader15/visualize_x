import express from "express"
const router = express.Router();
import { orderCountMonthly, orderCountYearly, totSalesDaily, totSalesMonthly, totSalesQuartely, totSalesYearly } from "../controllers/salesController.js";

// router.use('/', () =>{
//     console.log("Sales router is working");
// })
router.get('/total-sales-daily', totSalesDaily);
router.use('/total-sales-monthly', totSalesMonthly);
router.use('/total-sales/0.25', totSalesQuartely);
router.use('/total-sales-year', totSalesYearly);
router.use('/growth-monthly', orderCountMonthly);
router.use('/growth-yearly', orderCountYearly);

export default router;