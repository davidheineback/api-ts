import createError from 'http-errors'
import { Request, Response, NextFunction } from 'express'
import { getAccessAndRefreshToken, verifyRefreshToken, verifyAccessToken, getAccessToken } from './token-controller'
import { addUser, authorizeUser } from '../../repository/user-repository'
import { TokenInterface } from '../../models/TokenModel'
import { setToken, deleteToken, getTokenByEmail, getRefreshToken } from '../../repository/token-repository'
import { getAssociatedLinks, Links, Self } from '../../helpers/hateoas'

/**
 * Encapsulates a controller.
 */
export class AuthController {

index (req: Request, res: Response, next: NextFunction) {
  console.log('Hello!')

  const self: Self =  {
    url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
    method: req.method
  } 
    const linkSelection: Links = {
      register: true,
      login: true,
    }

const paths = getAssociatedLinks(self, linkSelection)
console.log(paths)

  res.json({ message: 'Authentication operations:', links: paths })
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

      res
        .status(201)
        .json({ id: user.username })
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
      
      res
        .status(200)
        .json({
          user: payload,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token
        })
    } catch (error) {
      // Authentication failed.
      const err = createError(401)
      err.innerException = error

      next(err)
    }
  }


  async logout (req: Request, res: Response, next: NextFunction) {
    const [Bearer, token] = <string[]>req.headers.authorization?.split(' ')
    try {
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
    const [Bearer, token] = <string[]>req.headers.authorization?.split(' ')
    if (Bearer === 'Bearer') {
    
      try {
        const refreshToken = await getRefreshToken(token)
        if (refreshToken) {
          verifyRefreshToken(token)
          const payload = { sub: 'username' }
          const newAccessToken = getAccessToken(payload)
          res
          .status(200)
          .json({
            user: payload,
            access_token: newAccessToken
          })
        } else {
          next(createError(401))
        }
        
      } catch (error) {
        const err = createError(401)
        err.innerException = error
        next(error)
      }
    } else {
      const error = createError(401)
      next(error)
    }
 

  }

  access(req: Request, res: Response, next: NextFunction) {
    console.log('acccesss')
    const [Bearer, token] = <string[]>req.headers.authorization?.split(' ')
    if (Bearer === 'Bearer') {
      try {
        verifyAccessToken(token)
        next()
      } catch (error) {
        const err = createError(401)
        err.innerException = error
        next(err)
      }
    }
  }

}
