import mongoose from 'mongoose'

export const connectDB = async () => {
    try {

        mongoose.set('strictQuery', false)
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log(`Databse connected ${conn.connection.host}`)

    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}