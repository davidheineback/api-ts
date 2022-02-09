import mongoose, { Schema } from 'mongoose'
import { UserModel } from './UserModel';

export interface TokenInterface {
  user: string,
  refreshToken: Schema.Types.ObjectId
}

const TokenSchema: Schema<TokenInterface> = new Schema (
  {
   user: {
      type: String,
      required: [true, 'user is required'],
      lowercase: true,
      trim: true
    },
    refreshToken: {
      type: Schema.Types.ObjectId,
      ref: UserModel,
      required: true,

    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

TokenSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60*60*24*100 }
)


export const TokenModel = mongoose.model<TokenInterface>('token', TokenSchema)
