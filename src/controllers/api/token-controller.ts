import createError from 'http-errors'
import { UserModel } from '../../models/UserInterface'
import * as globalMethod from './method-controller'

/**
 * Encapsulates a controller.
 */
export class TokenController {
  /**
   * Authenticates a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async login (req, res, next) {
    try {
      const user = await UserModel.authenticate(req.body.username, req.body.password)
      const payload = {
        sub: user.username,
        isAdmin: user.isAdmin
      }

      // Create the access token with the shorter lifespan.
      const accessToken = globalMethod.getAccessToken(payload)

      // Create the access token with the shorter lifespan.
      const refreshToken = globalMethod.getRefreshToken(payload)

      await UserModel.setToken(user.username, refreshToken)
      res
        .status(200)
        .json({
          user: payload,
          access_token: accessToken,
          refresh_token: refreshToken
        })
    } catch (error) {
      // Authentication failed.
      const err = createError(401)
      err.innerException = error

      next(err)
    }
  }

  /**
   * Logout a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {status} - Returns a status representing the logout proccess
   */
  async logout (req, res, next) {
    try {
      await UserModel.logout(req.body.user)
      res.sendStatus(204)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Authorize the user by validating the token.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Error} - Returns a error if user validation is failed.
   */
  async authenticateToken (req, res, next) {
    try {
      const userobj = await JSON.parse(Buffer.from(req.headers.authorization.split(' ')[1]).toString('ascii'))
      if (userobj.access_token === null) return res.sendStatus(401)
      const authObject = { body: userobj, secret: process.env.ACCESS_TOKEN_SECRET }
      const user = await User.findOne({ username: userobj?.user?.sub })
      const token = globalMethod.accessCheckCall(authObject, user)
      if (token) {
        res.token = token
        next()
      } else {
        res.sendStatus(401)
      }
    } catch (error) {
      res.status(403)
    }
  }

  /**
   * Sends the response.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @returns {Error} - Returns a error if user validation is failed.
   */
  async responseHandler (req, res) {
    const token = res.token
    if (token) {
      res.status(200).json(token)
    } else {
      res.sendStatus(401)
    }
  }

  /**
   * Registers a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async register (req, res, next) {
    try {
      const user = await UserModel.insert({
        username: req.body.username,
        password: req.body.password
      })

      res
        .status(201)
        .json({ id: user.id })
    } catch (error) {
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
}
