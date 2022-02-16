import mongoose, { Schema } from 'mongoose'

// Events: Login = new login from user, bid = Bid is placed on users item , end = auction ended , higherBid = someone outbid user

interface ValidHookEventsInterface {
  login?: boolean,
  bid?: boolean,
  higherBid?: boolean,
  end?: boolean
}

const ValidHooksSchema: Schema<ValidHookEventsInterface> = new Schema (
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
url: string,
events: ValidHookEventsInterface,
secret: string
}

const Webhookchema: Schema<WebhookInterface> = new Schema (
  {
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


export const WebhookModel = mongoose.model<WebhookInterface>('hook', Webhookchema)
  