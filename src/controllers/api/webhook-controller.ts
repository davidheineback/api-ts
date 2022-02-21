import createError from 'http-errors'
import { Request, Response, NextFunction } from 'express'
import { getAssociatedLinks, Links, Self } from '../../helpers/hateoas'
import { addItem, getAllItemsFrom, getItemFrom, deleteItem, updateItem, UpdateItem } from '../../repository/item-repository'
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


async subscribe(req: Request, res: Response, next: NextFunction) {
  const {user, name, images, description} = req.body

  const owner = await getUserByEmail(user)
  try {
    if (owner) {
      const item = await addItem({
        owner,
        name,
        images,
        description
      })
      res
      .status(201)
      .json({ item })
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
