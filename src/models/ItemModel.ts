import mongoose, { Schema } from 'mongoose'
import { UserInterface, UserModel } from './UserModel';

export interface ItemInterface {
  owner: UserInterface,
  item: string
  images: Array<string>,
  descrition: string,
  initialPrice: number,
  currentPrice: number
  highestBidder: UserInterface,
  expires: Date
  payed: boolean
}

const ItemSchema: Schema<ItemInterface> = new Schema (
  {
   owner: {
      type: UserModel,
      required: [true, 'User is required.'],
      lowercase: true,
      trim: true
    },
    item: {},
    images: {},
    descrition: {},
    initialPrice: {},
    currentPrice: {},
    highestBidder:  {},
    expires:  {},
    payed: {},
  },
  {
    timestamps: true,
    versionKey: false
  }
)


export const ItemModel = mongoose.model<ItemInterface>('item', ItemSchema)
