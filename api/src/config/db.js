import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn('⚠️  MONGO_URI is not set in .env')
      return
    }
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ MongoDB Connected successfully')
  } catch (error) {
    console.warn(`⚠️  MongoDB Connection Warning: ${error.message}`)
    console.warn('   (API server will run, but database features require MongoDB to be running)')
  }
}