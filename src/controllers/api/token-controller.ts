
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
    try {
      jwt.verify(token, REFRESH_TOKEN_SECRET!!)
    } catch (error: any) {
          throw createError(401, 
            `${error.message.includes('expired') ?
            'Access token expired': 
            'Access token invalid'
          }`)
    }
}

export function verifyAccessToken(token: string) {
  try {
    jwt.verify(token, ACCESS_TOKEN_SECRET!)
  } catch (error: any) {
        throw createError(401, 
          `${error.message.includes('expired') ?
          'Access token expired': 
          'Access token invalid'
        }`)
  }
}

