import mongoose from 'mongoose'

const connectDB= async ()=>{
    try {
        console.log("Connecting to database...")
        mongoose.connection.on('connected',()=>{
            console.log("MongoDB connected successfully")
        })
        await mongoose.connect(process.env.MONGODB_URI)

    } catch (error) {
        console.error("Error connecting mongodb",error)
    }
}
export default connectDB;