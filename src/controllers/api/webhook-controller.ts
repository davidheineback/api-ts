import createError from 'http-errors'
import { Request, Response, NextFunction } from 'express'
import { getAssociatedLinks, Links, createSelf } from '../../helpers/hateoas'
import { addHook } from '../../repository/webhook-repository'
import { getUserIDByEmail } from '../../repository/user-repository'

/**
 * Encapsulates a controller.
 */
export class WebhookController {

async subscribe(req: Request, res: Response, next: NextFunction) {
  const {user, events, secret, url} = req.body
  const owner = await getUserIDByEmail(user)
  Object.keys(events).includes  
  if (events)
  try {
    if (owner) {
      const hook = await addHook({
        user: owner,
        url,
        events:  events,
        secret
      })

      const self = createSelf(`${req.protocol}://${req.get('host')}${req.originalUrl}`, req.method)
      const linkSelection: Links = {
        login: true,
        logout: true,
        refresh: true,
        postWebhook: true,
        getItems: true,
        getItem: true,
        addItem: true
      }
  
      const entry = `${req.protocol}://${req.get('host')}`
      const paths = getAssociatedLinks(self, linkSelection, entry)


      res
      .status(201)
      .json({ hook, paths })
    } else {
      throw new Error('Invalid Hook.')
    }

  } catch (error: any) {
    let err = error
   if (error.name === 'ValidationError') {
      // Validation error(s).
      err = createError(400)
      err.innerException = error
    }
    next(err)
  }
}

}
