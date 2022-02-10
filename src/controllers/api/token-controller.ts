import createError from 'http-errors'
import { Request, Response, NextFunction } from 'express'
import { getAccessAndRefreshToken } from './method-controller'
import { addUser, authorizeUser } from '../../repository/user-repository'
import { TokenInterface } from '../../models/TokenModel'
import { setToken, deleteToken, getTokenByEmail } from '../../repository/token-repository'

/**
 * Encapsulates a controller.
 */
export class TokenController {

index (req: Request, res: Response, next: NextFunction) {
  console.log('Hello!')
  const self =  `${req.protocol}://${req.get('host')}${req.originalUrl}`
  const paths = 
{
  self,
  register: `${self}/register`,
  login: `${self}/login`,
  logout: `${self}/logout`
}

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
    const { username } = req.body
    try {
      const token = await getTokenByEmail(username)
      token && await deleteToken(token)
      res.sendStatus(204)
    } catch (error) {
      next(error)
    }
  }

  // /**
  //  * Authorize the user by validating the token.
  //  *
  //  * @param {object} req - Express request object.
  //  * @param {object} res - Express response object.
  //  * @param {Function} next - Express next middleware function.
  //  * @returns {Error} - Returns a error if user validation is failed.
  //  */
  // async authenticateToken (req, res, next) {
  //   try {
  //     const userobj = await JSON.parse(Buffer.from(req.headers.authorization.split(' ')[1]).toString('ascii'))
  //     if (userobj.access_token === null) return res.sendStatus(401)
  //     const authObject = { body: userobj, secret: process.env.ACCESS_TOKEN_SECRET }
  //     const user = await User.findOne({ username: userobj?.user?.sub })
  //     const token = globalMethod.accessCheckCall(authObject, user)
  //     if (token) {
  //       res.token = token
  //       next()
  //     } else {
  //       res.sendStatus(401)
  //     }
  //   } catch (error) {
  //     res.status(403)
  //   }
  // }

//   /**
//    * Sends the response.
//    *
//    * @param {object} req - Express request object.
//    * @param {object} res - Express response object.
//    * @returns {Error} - Returns a error if user validation is failed.
//    */
//   async responseHandler (req, res) {
//     const token = res.token
//     if (token) {
//       res.status(200).json(token)
//     } else {
//       res.sendStatus(401)
//     }
//   }
}
