import express from 'express'

import { AuthController } from '../../../controllers/api/auth-controller'

// add router::
export const router = express.Router()

const authController = new AuthController()

// Get routes::
router.route('/').get(authController.index)
router.route('/refresh').get(authController.refresh)

// Post routes::
router.route('/register').post(authController.register)
router.route('/login').post(authController.login)
router.route('/logout').delete(authController.logout)

