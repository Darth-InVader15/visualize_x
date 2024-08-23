import express from "express"
const router = express.Router();

router.use('/', (req,res) =>{
    res.send("Work in progress");
    console.log("Customer router is working");
})

export default router;