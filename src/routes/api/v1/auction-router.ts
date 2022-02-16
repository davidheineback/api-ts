import express from 'express'

import { TokenController } from '../../../controllers/api/token-controller'
import { AuctionController } from '../../../controllers/api/auction-controller'

// add router::
export const router = express.Router()

const tokenController = new TokenController()
const auctionController = new AuctionController()

// Get routes::
router.route('/').get(auctionController.index)
router.route('/:id/bid').post(tokenController.access, auctionController.index)
router.route('/:id')
  .get(auctionController.index)
  .delete(tokenController.access, auctionController.index)
