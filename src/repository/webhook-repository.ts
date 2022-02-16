import { WebhookInterface, WebhookModel } from '../models/WebhookModel'

export async function addHook(hooks: WebhookInterface): Promise<WebhookInterface> {
  const newHook = new WebhookModel(hooks)
  const saveHook = await newHook.save()
  return saveHook
}
