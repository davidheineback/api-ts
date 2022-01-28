
import jwt from 'jsonwebtoken'
import createError from 'http-errors'



/**
 * Filter product data before sending as response.
 *
 * @param {object} rawProduct - An object representing a product.
 * @returns {object} - A filtered object representing a product.
 */
export function escapeOutput (rawProduct) {
  return {
    name: rawProduct.name,
    description: rawProduct.description,
    detailedDescription: rawProduct.detailedDescription,
  }
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
    const newToken = jwt.verify(req.refresh_token, process.env.REFRESH_TOKEN_SECRET,
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

/**
 * Signs a jwt accesstoken.
 *
 * @param {object} payload - a payload to sign in jwt accesstoken
 * @returns {*} - A signed jwt accesstoken.
 */
export function getAccessToken (payload) {
  return (jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    algorithm: 'HS256',
    expiresIn: process.env.ACCESS_TOKEN_LIFE
  }))
}

/**
 * Signs a jwt refresh token.
 *
 * @param {object} payload - a payload to sign in jwt refreshtoken
 * @returns {*} - A signed jwt accesstoken.
 */
export function getRefreshToken (payload) {
  return (jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    algorithm: 'HS256',
    expiresIn: process.env.REFRESH_TOKEN_LIFE
  }))
}
