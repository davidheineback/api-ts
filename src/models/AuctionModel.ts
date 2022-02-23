import mongoose, { Schema } from 'mongoose'
import { ItemInterface, ItemModel, ItemType } from './ItemModel';
import { UserInterface } from './UserModel';

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
  item: ItemInterface
  initialPrice: number
  currentPrice?: number
  currency?: string
  highestBidder?: UserInterface
  bids?: Array<BidInterface>
  expires: Date
  payed?: boolean
}

const AuctionSchema: Schema<AuctionInterface> = new Schema (
  {
    item: {
      type: ItemType,
      required: true,
    },
    initialPrice: {
      type: Number,
      required: true
    },
    currentPrice: {
      type: Number,
    },
    currency: {
      type: String,
      default: 'SEK'
    },
    highestBidder:  {
      type: String
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
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)


export const AuctionModel = mongoose.model<AuctionInterface>('auction', AuctionSchema)
