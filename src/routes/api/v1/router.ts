import express from 'express'
import { router as authRouter } from './auth-router'
import { router as auctionRouter } from './auction-router'
import { router as itemRouter } from './item-router'
import { router as webhookRouter } from './webhook-router'
import { Request, Response, NextFunction } from 'express'

export const router = express.Router()


router.get('/', (req: Request, res: Response, next: NextFunction) => {
  const paths = 
{
  entry: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
  authenticate: `${req.protocol}://${req.get('host')}${req.originalUrl}/auth`,
  items: `${req.protocol}://${req.get('host')}${req.originalUrl}/items`,
  webhook: `${req.protocol}://${req.get('host')}${req.originalUrl}/webhook`,
  auctions: `${req.protocol}://${req.get('host')}${req.originalUrl}/auction`,
}
  res.json({ message: 'Welcome to this API!', paths })
})

router.use('/auth', authRouter)
router.use('/items', itemRouter)
router.use('/auctions', auctionRouter)
router.use('/webhook', webhookRouter)

