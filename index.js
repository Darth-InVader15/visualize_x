import express from "express";
import 'dotenv/config';
import cors from "cors";
import defaultRouter from "./routes/index.js"
import dbConnect from "./db.js"
const app = express();
const PORT = process.env.PORT;


app.use(cors());
app.use(express.json());

app.use('/api/v1', defaultRouter);

app.get('/', (req,res) => {
    res.send("X has a backend!");
})


dbConnect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is listening on ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`Error connnecting to the database ${error}`);
  });