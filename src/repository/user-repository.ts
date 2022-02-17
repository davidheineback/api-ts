import { UserInterface, UserModel } from '../models/UserModel'

export async function addUser(user: UserInterface): Promise<UserInterface> {
  const newUser = new UserModel(user)
  const saveUser = await newUser.save()
  return saveUser
}

export async function getUserByEmail(username: string) {
  const user = await UserModel.findOne({ username })
  return user
}


export async function authorizeUser(username: string, password: string) {
  const user = await getUserByEmail(username)
  if (user) {
    const authorized = await user.checkPassword(password)
    if (authorized) {
      return user
    }
  }
  throw new Error('Invalid Credentials')
}