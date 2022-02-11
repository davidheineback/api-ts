import express from 'express'

import { TokenController } from '../../../controllers/api/token-controller'

// add router::
export const router = express.Router()

const tokenController = new TokenController()

// Get routes::
router.route('/').get(tokenController.index)
router.route('/refresh').get(tokenController.refresh)
router.route('/access').get(tokenController.access)

// Post routes::
router.route('/register').post(tokenController.register)
router.route('/login').post(tokenController.login)
router.route('/logout').post(tokenController.logout)
