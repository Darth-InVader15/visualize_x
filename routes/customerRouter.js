import express from "express"
import { monthlyCust, yearlyCust } from "../controllers/customerController.js";
const router = express.Router();

// router.use('/', (req,res) =>{
//     res.send("Work in progress");
//     console.log("Customer router is working");
// })
router.use('/new-customers/month', monthlyCust);
router.use('/new-customers/year', yearlyCust);

export default router;