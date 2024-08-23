import mongoose from "mongoose";
import 'dotenv/config'

const URI = process.env.MONGODB_URI;

const dbConnect = async() => {
    try {
        await mongoose.connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};
export default dbConnect;