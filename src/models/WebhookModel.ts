import mongoose, { Schema } from 'mongoose'
import { UserInterface } from './UserModel';

// Events: Login = new login from user, bid = Bid is placed on users item , end = auction ended , higherBid = someone outbid user


export enum ValidHookEvent {
  LOGIN = 'login',
  BID = 'bid',
  HIGERBID = 'higherBid',
  END = 'end'
}

// export const HookEvents = [
//   ValidHookEvent.LOGIN,
//   ValidHookEvent.BID,
//   ValidHookEvent.HIGERBID,
//   ValidHookEvent.END
// ]

export const HookEvents = {
  login: {type: Boolean, default: false},
  bid: {type: Boolean, default: false},
  higherBid: {type: Boolean, default: false},
  end: {type: Boolean, default: false}
}

export interface ValidHookEventsInterface {
  login: boolean
  bid: boolean
  higherBid: boolean
  end: boolean,
}


export interface WebhookInterface {
user: UserInterface
url: string
events: ValidHookEventsInterface
secret: string
}

const WebhookSchema: Schema<WebhookInterface> = new Schema (
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required.'],
    },
    url: {
      type: String,
      required: true,
      trim: true
    },
    events: HookEvents,
    secret: {
      type: String,
      required: [true, 'Webhook secret is required.'],
      minlength: [10, 'Webhook secret must be at least 10 characters long.']
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)


export const WebhookModel = mongoose.model<WebhookInterface>('hook', WebhookSchema)
  