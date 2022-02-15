import mongoose, { Schema } from 'mongoose'

// Events: Login = new login from user, bid = Bid is placed on users item , end = auction ended , higherBid = someone outbid user

type HookEvents = {
  login?: boolean,
  bid?: boolean,
  higherBid: boolean,
  end?: boolean
}

export interface WebhookInterface {
url: string,
event: HookEvents,
secret: string
}

const Webhookchema: Schema<WebhookInterface> = new Schema (
  {
    url: {},
    event: {},
    secret: {}
  },
  {
    timestamps: true,
    versionKey: false
  }
)


export const WebhookModel = mongoose.model<WebhookInterface>('hook', Webhookchema)
  