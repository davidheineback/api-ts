import mongoose, { Schema } from 'mongoose'
import { UserModel } from './UserModel';

export interface TokenInterface {
  username: string,
  refreshToken: string
}

const TokenSchema: Schema<TokenInterface> = new Schema (
  {
   username: {
      type: String,
      required: [true, 'User is required.'],
      lowercase: true,
      trim: true
    },
    refreshToken: {
      type: String,
      ref: UserModel,
      required: [true, 'Token is required.']

    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

TokenSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60*60*24*6 }
)


export const TokenModel = mongoose.model<TokenInterface>('token', TokenSchema)
