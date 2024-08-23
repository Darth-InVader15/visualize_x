import express from "express";
import 'dotenv/config'
const app = express();
const PORT = process.env.PORT;

app.get('/', (req,res) => {
    res.send("X has a backend!");
})


app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
})