import bcrypt from 'bcrypt'
import mongoose, { Document, Schema } from 'mongoose'
import validator from 'validator';

export interface UserInterface {
  firstName: string
  lastName: string
  username: string
  password: string
}

interface UserDocumentInterface extends UserInterface, Document {
  checkPassword: (password: string) => Promise<boolean>
}

const UserSchema: Schema<UserDocumentInterface> = new Schema (
  {
    firstName: {
      type: String,
      required: [true, 'Firstname is required'],
      trim: true,
      lowercase: true,
    },
    lastName: {
      type: String,
      required: [true, 'Lastname is required'],
      trim: true,
      lowercase: true,
    },
    username: {
      type: String,
      required: [true, 'username is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, '{VALUE} is not a valid email']
    },
    password: {
      type: String,
      minlength: [10, 'Password must be at least 10 characters long'],
      required: [true, 'Password is required']
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

UserSchema.pre('save', async function preSave (this: UserDocumentInterface, next) {
  if (!this.isModified('password')) {
    next()
  }
  this.password = await bcrypt.hash(this.password, 10)
})

UserSchema.methods.checkPassword = async function (password: string) {
  const compare = await bcrypt.compare(password, this.password)
  return compare
}

export const UserModel = mongoose.model<UserDocumentInterface>('User', UserSchema)
