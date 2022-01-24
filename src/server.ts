// import { connectDB } from './config/mongoose';
import { errorMiddleware } from './middlewares/error-middleware';
import express, { Application } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import logger from 'morgan'
import { router } from './routes/router';



const main = async () => {
  // await connectDB()
  const app: Application = express()

  // Security
  app.use(helmet())
  app.use(cors())

  // Logging
  app.use(logger('dev'))

  // Parse requests of the content type application/json.
  app.use(express.json())


  app.use(router)

  app.use(errorMiddleware)

  app.listen(process.env.PORT, () => {
    console.log(
      `Server running in ${process.env.NODE_ENV} at http://localhost:${process.env.PORT}`
    )
    console.log('Press Ctrl-C to terminate...')

  })

}

main().catch(console.error)