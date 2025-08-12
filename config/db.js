import mongoose from "mongoose";

async function connectDB (){
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
        console.error(error.message);
        console.log('❌ MongoDB connection Failed');
        process.exit(1);
    }
}

export default connectDB;