import express from 'express'

import { AuthController } from '../../../controllers/api/auth-controller'
import { ItemController } from '../../../controllers/api/item-controller'

// add router::
export const router = express.Router()

const tokenController = new AuthController()
const itemController = new ItemController()

// Get routes::
router.route('/')
  .get(itemController.index)
  .post(tokenController.access, itemController.index)

router.route('/:id/bid').post(tokenController.access, itemController.index)
router.route('/:id')
  .get(itemController.index)
  .delete(tokenController.access, itemController.index)
