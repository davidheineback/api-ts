import createError from 'http-errors'
import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { getAccessAndRefreshToken, verifyRefreshToken, verifyAccessToken, getAccessToken } from './token-controller'
import { addUser, authorizeUser } from '../../repository/user-repository'
import { TokenInterface } from '../../models/TokenModel'
import { setToken, deleteToken, getRefreshToken } from '../../repository/token-repository'
import { createSelf, getAssociatedLinks, Links } from '../../helpers/hateoas'
import { emitter } from '../../helpers/emit-hook'
import { ValidHookEvent } from '../../models/WebhookModel'

/**
 * Encapsulates a controller.
 */
export class AuthController {

index (req: Request, res: Response, next: NextFunction) {

  const self = createSelf(`${req.protocol}://${req.get('host')}${req.originalUrl}`, req.method)
    const linkSelection: Links = {
      register: true,
      login: true,
      logout: true,
      refresh: true
    }

const paths = getAssociatedLinks(self, linkSelection)

  res.json({ message: 'Authentication operations:', paths })
}



  async register (req: Request, res: Response, next: NextFunction) {

   const {firstName, lastName, username, password} = req.body

    try {
      const user = await addUser({
        firstName,
        lastName,
        username,
        password
      })

      const self = createSelf(`${req.protocol}://${req.get('host')}${req.originalUrl}`, req.method)
      const linkSelection: Links = {
        register: true,
        login: true
      }
  
      const paths = getAssociatedLinks(self, linkSelection)

      res
        .status(201)
        .json({ id: user.username, paths })
    } catch (error: any) {
      let err = error

      if (err.code === 11000) {
        // Duplicated keys.
        err = createError(409)
        err.innerException = error
      } else if (error.name === 'ValidationError') {
        // Validation error(s).
        err = createError(400)
        err.innerException = error
      }
      next(err)
    }
  }


  async login (req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body
    try {
      const user = await authorizeUser(username, password)
      const payload = {
        sub: user.username
      }

      const tokens = getAccessAndRefreshToken(payload)

      const refreshToken: TokenInterface = {
        username: user.username,
        refreshToken: tokens.refresh_token
      }

      await setToken(refreshToken)
      
      emitter.emit(ValidHookEvent.LOGIN, user._id)

      const self = createSelf(`${req.protocol}://${req.get('host')}${req.originalUrl}`, req.method)
      const linkSelection: Links = {
        login: true,
        logout: true,
        refresh: true,
        postWebhook: true,
        getItems: true,
        getItem: true,
        addItem: true
      }
  
      const paths = getAssociatedLinks(self, linkSelection)

      res
        .status(200)
        .json({
          user: payload,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          paths
        })
    } catch (error) {
      // Authentication failed.
      const err = createError(401)
      err.innerException = error

      next(err)
    }
  }


  async logout (req: Request, res: Response, next: NextFunction) {
    try {
      const [Bearer, token] = <string[]>req.headers.authorization?.split(' ')
      if (Bearer === 'Bearer') {
        token && await deleteToken(token)
        res.sendStatus(204)
      } else {
        throw new Error('Invalid Authentication')
      }
      
    } catch (error) {
      const err = createError(401)
      err.innerException = error
      next(err)
    }
  }


  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
    const [Bearer, token] = <string[]>req.headers.authorization?.split(' ')
    if (Bearer === 'Bearer') {
    
 
        const refreshToken = await getRefreshToken(token)
        if (refreshToken) {
          verifyRefreshToken(token)
          req.body.user = jwt.decode(token)?.sub
          const payload = { sub: req.body.user }
          const newAccessToken = getAccessToken(payload)

          const self = createSelf(`${req.protocol}://${req.get('host')}${req.originalUrl}`, req.method)
          const linkSelection: Links = {
            login: true,
            logout: true,
            refresh: true,
            postWebhook: true,
            getItems: true,
            getItem: true,
            addItem: true
          }
      
          const paths = getAssociatedLinks(self, linkSelection)
    
          res
          .status(200)
          .json({
            user: payload,
            access_token: newAccessToken,
            paths
          })
        } else {
          next(createError(401))
        }
    } else {
      const error = createError(401)
      next(error)
    }
  } catch (error) {
    const err = createError(401)
    err.innerException = error
    next(error)
  }
 

  }

  access(req: Request, res: Response, next: NextFunction) {
    try {
    const [Bearer, token] = <string[]>req.headers.authorization?.split(' ')
    if (Bearer === 'Bearer') {
        verifyAccessToken(token)
        req.body.user = jwt.decode(token)?.sub
        next()
    } else {
      const error = createError(401)
      next(error)
    }
  } catch (error) {
      error = createError(401)
      next(error)
    }
  }

}
