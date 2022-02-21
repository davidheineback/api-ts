import EventEmitter from 'events'
import { ValidHookEvent, WebhookInterface, WebhookModel } from '../models/WebhookModel'
import { getUserWebHook } from '../repository/webhook-repository'
import moment from 'moment'
import axios from 'axios'
import createError from 'http-errors'

export const emitter = new EventEmitter()




export function addEventListener() {
  emitter.on(ValidHookEvent.LOGIN, async(userID) => {
    try {
      const loginHook:  = await getUserWebHook(userID, ValidHookEvent.LOGIN)
      if (loginHook) {
        postHookEvent(loginHook!.url!, loginHook.secret!)
      } else {
        throw createError(400)
      }
    } catch (error) {
      
    }
  } )

  async function postHookEvent(url: string, secret: string) {
    const headers = {
      'Content-Type': 'application/json',
      'x-itemApp-secret': secret
    }
    const body = {
      event: `x-${ValidHookEvent.LOGIN}-event`,
      timestamp: moment().toISOString()
    }
    await axios.post(url, body, { headers })
  }
}