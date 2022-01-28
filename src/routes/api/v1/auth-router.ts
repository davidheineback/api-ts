import express from 'express'

import { TokenController } from '../../../controllers/api/token-controller'

// add router::
export const router = express.Router()

const tokenController = new TokenController()

// Get routes::
router.route('/').get(tokenController.authenticateToken)


// Post routes::
router.route('/admin/login').post(tokenController.login)
router.route('/admin/logout').post(tokenController.logout)
