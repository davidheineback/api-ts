import express from 'express'
import { router as authRouter } from './auth-router'
import { Request, Response, NextFunction } from 'express'

export const router = express.Router()


router.get('/', (req: Request, res: Response, next: NextFunction) => {
  const paths = 
{
  entry: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
  authenticate: `${req.protocol}://${req.get('host')}${req.originalUrl}/auth`,
}
  res.json({ message: 'Welcome to this API!', links: paths })
})

router.use('/auth', authRouter)

