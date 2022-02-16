import mongoose, { Schema } from 'mongoose'
import { UserInterface, UserModel } from './UserModel';

export interface ItemInterface {
  owner: UserInterface,
  name: string
  images: Array<string>,
  descrition: string,
  activeAuction: boolean
}

const ItemSchema: Schema<ItemInterface> = new Schema (
  {
   owner: {
      type: UserModel,
      required: [true, 'User is required.'],
      lowercase: true,
      trim: true
    },
    name: {
      type: String,
      required: [true, 'Name is required.']
    },
    images: {
      type: [],
      default: []
    },
    descrition: {
      type: String,
      required: [true, 'Description is required.']
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)


export const ItemModel = mongoose.model<ItemInterface>('item', ItemSchema)
