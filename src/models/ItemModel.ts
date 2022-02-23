import mongoose, { Schema } from 'mongoose'
import { UserInterface } from './UserModel';

export interface ItemInterface {
  owner: UserInterface
  name: string
  images?: Array<string>
  description: string
  activeAuction?: boolean
}

export const ItemType: Schema<ItemInterface> = new Schema ({
  owner: {type: Schema.Types.ObjectId, required: true},
  name: {type: String, required: true},
  images: {type: [String], default: []},
  description: {type: String, required: true},
  activeAuction: {type: Boolean, required: false},
})

const ItemSchema: Schema<ItemInterface> = new Schema (
  {
   owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required.'],
    },
    name: {
      type: String,
      required: [true, 'Name is required.']
    },
    images: {
      type: [],
      default: []
    },
    description: {
      type: String,
      required: [true, 'Description is required.']
    },
    activeAuction: {
      type: Boolean
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)


export const ItemModel = mongoose.model<ItemInterface>('item', ItemSchema)
