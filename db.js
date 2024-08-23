import mongoose from "mongoose";
import 'dotenv/config'

const URI = process.env.MONGODB_URI;

const dbConnect = async() => {
    try {
        console.log("Connecting to MongoDB...");
    await mongoose.connect(URI);
    console.log("Connected to MongoDB !\n");
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};
export default dbConnect;