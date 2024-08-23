import express from "express"
const router = express.Router();
import salesRouter from "./salesRouter.js";
import customerRouter from "./customerRouter.js";

router.use("/sales", salesRouter); //for handling all the sales data
router.use("/customer", customerRouter); //for handling all customer data

export default router;
