import bcrypt from 'bcrypt'
import mongoose from 'mongoose'

interface UserInterface {
  fName: string
  lName: string
  email: string
  password: string
}

interface UserDocumentInterface extends UserInterface, mongoose.Document {
  savePassword: (password: string) => Promise<void>
  validatePassword: (password: string) => Promise<boolean>
}

interface UserModelInterface extends mongoose.Model<UserDocumentInterface> {
  findByEmail: (email: string) => Promise<UserDocumentInterface>
}

const schema: mongoose.Schema<UserDocumentInterface> = new mongoose.Schema({
  fName: {
    type: String,
    required: true
  },
  lName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
})

schema.methods.savePassword = async function(password: string) {
  const hash = await bcrypt.hash(password, 10)
  this.password = hash
}

schema.methods.validatePassword = async function(password: string) {
  const validity = await bcrypt.compare(password, this.password)
  return validity
}

schema.statics.findByEmail = function (email: string) {
  return this.findOne({ email })
}



const UserModel = mongoose.model<UserDocumentInterface, UserModelInterface>('User', schema)

export { UserModel }