
import jwt from 'jsonwebtoken'
import createError from 'http-errors'

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
  return createToken(payload, ACCESS_TOKEN_SECRET!, ACCESS_TOKEN_LIFE!)
}

export function getAccessAndRefreshToken (payload: Payload) {
  const access_token = createToken(payload, ACCESS_TOKEN_SECRET!, ACCESS_TOKEN_LIFE!)
  const refresh_token = createToken(payload, REFRESH_TOKEN_SECRET!, REFRESH_TOKEN_LIFE!)
  return { access_token, refresh_token }
}

export function verifyRefreshToken(token: string) {
  jwt.verify(token, REFRESH_TOKEN_SECRET!,
    (error) => {
      if (error) {
        if (error.message.includes('expired')) {
          throw new Error('Refresh token expired')
        } else {
          throw new Error('Refresh token invalid')
          // return createError(403)
        }
      }
    })
}

export function verifyAccessToken(token: string) {
  jwt.verify(token, ACCESS_TOKEN_SECRET!,
    (error) => {
      console.log('in error')
      if (error) {
        if (error.message.includes('expired')) {
          throw new Error('Access token expired')
        } else {
          // return createError(403)
          throw new Error('Access token invalid')
        }
      }
    })
}

