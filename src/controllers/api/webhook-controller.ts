import createError from 'http-errors'
import { Request, Response, NextFunction } from 'express'
import { getAssociatedLinks, Links, Self } from '../../helpers/hateoas'
import { addHook } from '../../repository/webhook-repository'
import { getUserByEmail, getUserIDByEmail } from '../../repository/user-repository'

/**
 * Encapsulates a controller.
 */
export class WebhookController {

index(req: Request, res: Response, next: NextFunction) {
  console.log(req.params)
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

// {
//   user:
//   url: 
//   events: {
//     type: ValidHooksSchema,
//     required: true
//   },
//   secret:
// }


async subscribe(req: Request, res: Response, next: NextFunction) {
  const {user, events} = req.body
  const owner = await getUserIDByEmail(user)
  console.log(events)
  try {
    if (owner) {
      const hook = await addHook({
        user: owner,
        url: 'https://webhook.site/bcfe19bc-ccc4-47a5-957c-2704ef01ab84',
        events:  events,
        secret: 'aaksndajfbnsbsj'
      })
      res
      .status(201)
      .json({ hook })
    } else {
      throw new Error('Invalid User.')
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
