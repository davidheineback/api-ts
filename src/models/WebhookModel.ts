import mongoose, { Schema } from 'mongoose'
import { UserInterface } from './UserModel';

// Events: Login = new login from user, bid = Bid is placed on users item , end = auction ended , higherBid = someone outbid user


export enum ValidHookEvent {
  LOGIN = 'login',
  BID = 'bid',
  HIGERBID = 'higherBid',
  END = 'end'
}

export interface ValidHookEventsInterface {
  login?: boolean,
  bid?: boolean,
  higherBid?: boolean,
  end?: boolean
}

export const ValidHooksSchema: Schema<ValidHookEventsInterface> = new Schema (
  {
    login: {
      type: Boolean,
    },
    bid: {
      type: Boolean,
    },
    higherBid: {
      type: Boolean,
    },
    end: {
      type: Boolean
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export interface WebhookInterface {
user: UserInterface,
url: string,
events: ValidHookEventsInterface,
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
    events: {
      type: ValidHooksSchema,
      required: true
    },
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
  