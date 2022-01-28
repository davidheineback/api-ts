import mongoose, { Connection } from 'mongoose'

const connectDB = () => new Promise((resolve, reject) => {
  mongoose.connect(`${process.env.DB_CONNECTION_STRING_TEST}`)

  const dbConnection: Connection = mongoose.connection

  dbConnection.on('error', err => {
    console.log('Database connection error.')
    reject(err)
  })

  dbConnection.once('open', () => {
    console.log('Database connection established.')
    resolve(mongoose)
  })

  dbConnection.on('close', console.info.bind(console, 'Database connection closed.'))
})

export { connectDB }