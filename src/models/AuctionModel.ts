import mongoose, { Schema } from 'mongoose'
import { ItemInterface } from './ItemModel';
import { UserInterface, UserModel } from './UserModel';

type Bid = {
  bidder: UserInterface,
  bid: number,
  timestamp: Date
}

export interface AuctionInterface {
  item: ItemInterface,
  initialPrice: number
  currentPrice: number
  highestBidder: UserInterface
  bids: Array<Bid>
  expires: Date
  payed: boolean
}

const AuctionSchema: Schema<AuctionInterface> = new Schema (
  {
    item: {},
    currentPrice: {},
    highestBidder:  {},
    expires:  {},
    payed: {}
  },
  {
    timestamps: true,
    versionKey: false
  }
)


export const AuctionModel = mongoose.model<AuctionInterface>('auction', AuctionSchema)
