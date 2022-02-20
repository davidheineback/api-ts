import createError from 'http-errors'
import { Request, Response, NextFunction } from 'express'
import { getAssociatedLinks, Links, Self } from '../../helpers/hateoas'
import { addItem, getAllItemsFrom, getItemFrom } from '../../repository/item-repository'
import { getUserByEmail, getUserIDByEmail } from '../../repository/user-repository'

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

async getAllUserItems(req: Request, res: Response, next: NextFunction) {
  const userID = await getUserIDByEmail(req.body.user)
  console.log(userID)
  if (userID) {
    const items = await getAllItemsFrom(userID)
    res.json({ items, links: 'All' })
  } else {
    res.sendStatus(404)
  }
  
  }

async getUserItem(req: Request, res: Response, next: NextFunction) {
  console.log(req.params.id)
  try {
    const userID = await getUserIDByEmail(req.body.user)
    const item = await getItemFrom(req.params.id)
    if (item) {
      console.log(userID)
      console.log(item.owner)
      if (userID === item.owner) {
        console.log(item)
        res.json({ item, links: 'One' })
      } else { 
        next(createError(403))
      }
    } else {
      next(createError(404))
    }
  } catch (error) {
    next(createError(404))
  }

  
  }

async createItem(req: Request, res: Response, next: NextFunction) {
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
