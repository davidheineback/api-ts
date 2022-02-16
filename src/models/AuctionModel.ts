import mongoose, { Schema } from 'mongoose'
import { ItemInterface, ItemModel } from './ItemModel';
import { UserInterface, UserModel } from './UserModel';

interface BidInterface {
  bidder: UserInterface,
  bid: number,
  timestamp: Date
}

const BidSchema: Schema<BidInterface> = new Schema (
  {
    bidder: {
      type: String,
      required: true,
    },
    bid: {
      type: Number,
      required: true
    },
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export interface AuctionInterface {
  item: ItemInterface,
  initialPrice: number
  currentPrice: number
  highestBidder: UserInterface
  bids: Array<BidInterface>
  expires: Date
  payed: boolean
}

const AuctionSchema: Schema<AuctionInterface> = new Schema (
  {
    item: {
      type: ItemModel,
      required: true,
    },
    initialPrice: {
      type: Number,
      required: true
    },
    currentPrice: {
      type: Number,
    },
    highestBidder:  {
      type: UserModel
    },
    bids: {
      type: [BidSchema],
      default: []
    },
    expires:  {
      type: Date,
      required: [true, 'End date is required.']
    },
    payed: {
      type: Boolean
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)


export const AuctionModel = mongoose.model<AuctionInterface>('auction', AuctionSchema)
