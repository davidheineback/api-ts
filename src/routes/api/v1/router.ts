import express from 'express'
import { router as authRouter } from './auth-router'

export const router = express.Router()

router.get('/', (req, res) => res.json({ message: 'Hooray! Welcome to version 1 of this very simple RESTful API!' }))
router.use('/', authRouter)
