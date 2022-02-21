import { ValidHookEvent, WebhookInterface, WebhookModel } from '../models/WebhookModel'

export async function addHook(hooks: WebhookInterface): Promise<WebhookInterface> {
  const newHook = new WebhookModel(hooks)
  const saveHook = await newHook.save()
  return saveHook
}

export async function getUserWebHook(userID: string, event:ValidHookEvent ) {

  const hooks = await WebhookModel.find({ user: userID })
  if (hooks.length > 0) {
    console.log('hej')
    return hooks.filter(hook => hook.events[event])
  }
  
  return hooks
}


