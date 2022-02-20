import express from 'express'

import { AuthController } from '../../../controllers/api/auth-controller'
import { AuctionController } from '../../../controllers/api/auction-controller'

// add router::
export const router = express.Router()

const tokenController = new AuthController()
const auctionController = new AuctionController()

// Get routes::
router.route('/')
  .get(auctionController.index)
  .post(tokenController.access, auctionController.index)

router.route('/:id/bid')
  .post(tokenController.access, auctionController.index)
  
router.route('/:id')
  .get(auctionController.index)
  .delete(tokenController.access, auctionController.index)
