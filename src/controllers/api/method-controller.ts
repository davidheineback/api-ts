
import jwt from 'jsonwebtoken'
import createError from 'http-errors'
import { Request, Response, NextFunction } from 'express'

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, ACCESS_TOKEN_LIFE, REFRESH_TOKEN_LIFE } = process.env

export type Payload = {
  sub: string
}

 export function createToken (payload: Payload, secret: string, life: string) {
  return (jwt.sign(payload, secret, {
    algorithm: 'HS256',
    expiresIn: life
  }))
}

 export function getAccessToken (payload: Payload) {
  return createToken(payload, ACCESS_TOKEN_SECRET!, ACCESS_TOKEN_SECRET!)
}

export function getAccessAndRefreshToken (payload: Payload) {
  const access_token = createToken(payload, ACCESS_TOKEN_SECRET!, ACCESS_TOKEN_LIFE!)
  const refresh_token = createToken(payload, REFRESH_TOKEN_SECRET!, REFRESH_TOKEN_LIFE!)
  return { access_token, refresh_token }
}



/**
 * Handles refreshtoken.
 *
 * @param {object} req - represents request object.
 * @param {object} user - represents request object.
 * @returns {string} - A string with a token || a Error.
 */
export function accessCheckCall (req, user) {
  jwt.verify(req.body.access_token, req.secret,
    (error) => {
      if (error) {
        if (error.message.includes('expired')) {
          req.body.access_token = refreshCall(req.body, user)
        } else {
          return createError(403)
        }
      }
    })
  return req.body.access_token
}

/**
 * Handles refreshtoken.
 *
 * @param {object} req - represents request object.
 * @param {object} user - represents request object.
 * @returns {status} - Returns a status.
 */
function refreshCall (req, user) {
  if (user.refreshToken === req.refresh_token) {
    const newToken = jwt.verify(req.refresh_token, REFRESH_TOKEN_SECRET!,
      (error, user) => {
        if (error) {
          return createError(403)
        }
        const payload = {
          sub: user.username,
          isAdmin: user.isAdmin
        }
        const token = getAccessToken(payload)
        return token
      })
    return newToken
  } else {
    return createError(401)
  }
}

// /**
//  * Filter product data before sending as response.
//  *
//  * @param {object} rawProduct - An object representing a product.
//  * @returns {object} - A filtered object representing a product.
//  */
// export function escapeOutput (rawProduct: {name: string, description: string, detailedDescription: string}) {
//   return {
//     name: rawProduct.name,
//     description: rawProduct.description,
//     detailedDescription: rawProduct.detailedDescription,
//   }
// }
