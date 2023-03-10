// import mongoose from 'mongoose'
// import mongoose from 'mongoose'
const mongoose = require('mongoose')

const connectDB = async () => {
  try {
   
    const conn = await mongoose.connect(MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    })
    console.log(MONGO_URI)
    // console.log(`MongoDB connected: ${conn.connection.host}`.cyan.underline)
    // console.log(`MongoDB connected: ${conn.connection.host}`)
    console.log(`MongoDB connected: `)
  } catch (error) {
    // console.error(`Error: ${error.message}`.red.underline.bold)
    console.error(`Error: ${error.message}`)
    // exit process with failture
    process.exit(1)
  }
}

// export default connectDB
