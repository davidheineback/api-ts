import { TokenInterface, TokenModel } from '../models/TokenModel'

export async function setToken(token: TokenInterface): Promise<TokenInterface> {
  const newToken = new TokenModel(token)
  const saveToken = await newToken.save()
  return saveToken
}

export async function getRefreshToken(refreshToken: string) {
  return await TokenModel.findOne({ refreshToken })
}

export async function deleteToken(refreshToken: string) {
  return await TokenModel.findOneAndDelete({ refreshToken })
}

export async function getTokenByEmail(user: string) {
  const token = await TokenModel.findOne({ user })
  return user
}

