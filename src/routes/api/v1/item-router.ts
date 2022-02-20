import express from 'express'

import { AuthController } from '../../../controllers/api/auth-controller'
import { ItemController } from '../../../controllers/api/item-controller'

// add router::
export const router = express.Router()

const tokenController = new AuthController()
const itemController = new ItemController()

// Get routes::
router.route('/')
  .all(tokenController.access)
  .get(itemController.getAllUserItems)
  .post(itemController.createItem)

router.route('/:id')
.all(tokenController.access)
.get(itemController.getUserItem)
.put(itemController.updateUserItem)
.delete(itemController.deleteUserItem)
