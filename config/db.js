import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to the database successfully');
        
    } catch (error) {
        console.error(`Error: ${error.message}`)
        process.exit(1)
    }
}
export default connectDB