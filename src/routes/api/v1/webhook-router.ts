import express from 'express'

import { AuthController } from '../../../controllers/api/auth-controller'
import { WebhookController } from '../../../controllers/api/webhook-controller'

// add router::
export const router = express.Router()

const tokenController = new AuthController()
const webhookController = new WebhookController()

// Get routes::
router.route('/')
  .all(tokenController.access)
  .get(webhookController.index)
  .post(webhookController.subscribe)
