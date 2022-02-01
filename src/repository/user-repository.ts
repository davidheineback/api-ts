import { UserInterface, UserModel } from '../models/UserModel'

export async function addUser(user: UserInterface): Promise<UserInterface> {
  const newUser = new UserModel(user)
  const saveUser = await newUser.save()
  return saveUser
}

export async function getUserByEmail(email: string) {
  const user = await UserModel.findOne({ email })
  return user
}

export async function authorizeUser(email: string, password: string) {
  const user = await getUserByEmail(email)
  if (user) {
    const authorized = await user.checkPassword(password)
    if (authorized) {
      return user
    }
  }
  throw new Error('Invalid Credentials')
}