import { WebhookInterface, WebhookModel } from '../models/WebhookModel'

export async function addHook(hooks: WebhookInterface): Promise<WebhookInterface> {
  const newHook = new WebhookModel(hooks)
  const saveHook = await newHook.save()
  return saveHook
}

export async function getUserWebHook(userID: string, event: string) {
  return await WebhookModel.find({ user: userID, events: event })
}