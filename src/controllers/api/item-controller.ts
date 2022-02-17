import createError from 'http-errors'
import { Request, Response, NextFunction } from 'express'
import { getAssociatedLinks, Links, Self } from '../../helpers/hateoas'
import { addItem } from '../../repository/item-repository'
import { getUserByEmail } from '../../repository/user-repository'

/**
 * Encapsulates a controller.
 */
export class ItemController {

index(req: Request, res: Response, next: NextFunction) {
  console.log(req.params)
  console.log('Hello from Item index')
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

async createItem(req: Request, res: Response, next: NextFunction) {
  const {user, name, images, description} = req.body

  const owner = await getUserByEmail(user)
  console.log(owner)
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
    console.log(error)
    let err = error

    if (err.code === 11000) {
      // Duplicated keys.
      err = createError(409)
      err.innerException = error
    } else if (error.name === 'ValidationError') {
      // Validation error(s).
      err = createError(400)
      err.innerException = error
    }
    next(err)
  }
}

}
