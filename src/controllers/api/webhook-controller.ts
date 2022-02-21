import createError from 'http-errors'
import { Request, Response, NextFunction } from 'express'
import { getAssociatedLinks, Links, Self } from '../../helpers/hateoas'
import { addHook } from '../../repository/webhook-repository'
import { getUserIDByEmail } from '../../repository/user-repository'

/**
 * Encapsulates a controller.
 */
export class WebhookController {

index(req: Request, res: Response, next: NextFunction) {
  console.log('Hello from Hook index')
  const self: Self = {
    url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
    method: req.method
  } 
    const linkSelection: Links = {
      register: true,
      login: true,
    }

const paths = getAssociatedLinks(self, linkSelection)
// console.log(paths)

  res.json({ message: 'Item operations:', links: paths })
}


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
      res
      .status(201)
      .json({ hook })
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
