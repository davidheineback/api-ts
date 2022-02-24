import createError from 'http-errors'
import { Request, Response, NextFunction } from 'express'
import { getAssociatedLinks, Links, createSelf } from '../../helpers/hateoas'
import { addItem, getAllItemsFrom, getItemFrom, deleteItem, updateItem, UpdateItem } from '../../repository/item-repository'
import { getUserByEmail, getUserIDByEmail } from '../../repository/user-repository'

/**
 * Encapsulates a controller.
 */
export class ItemController {

index(req: Request, res: Response, next: NextFunction) {
  const self = createSelf(`${req.protocol}://${req.get('host')}${req.originalUrl}`, req.method)
  const linkSelection: Links = {
    logout: true,
    refresh: true,
    getItems: true,
    getItem: true,
    addItem: true
  }

const paths = getAssociatedLinks(self, linkSelection)

  res.json({ message: 'Item operations:', paths })
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

      const self = createSelf(`${req.protocol}://${req.get('host')}${req.originalUrl}`, req.method)
      const linkSelection: Links = {
        addItem: true,
        getItems: true,
        getItem: true,
        changeItem: true,
        logout: true,
        refresh: true
      }
  
      const paths = getAssociatedLinks(self, linkSelection)
      res
      .status(201)
      .json({ item, paths })
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

async getAllUserItems(req: Request, res: Response, next: NextFunction) {
  const userID = await getUserIDByEmail(req.body.user)
  console.log(userID)
  if (userID) {
    const items = await getAllItemsFrom(userID)

    const self = createSelf(`${req.protocol}://${req.get('host')}${req.originalUrl}`, req.method)
    const linkSelection: Links = {
      getItems: true,
      getItem: true,
      addItem: true,
      changeItem: true,
      deleteItem: true,
      logout: true,
      refresh: true
    }
    const paths = getAssociatedLinks(self, linkSelection)

    res.json({ items, paths })
  } else {
    res.sendStatus(404)
  }
  
  }

async getUserItem(req: Request, res: Response, next: NextFunction) {
  try {
    const userID = await getUserIDByEmail(req.body.user)
    const item = await getItemFrom(req.params.id)
    if (item) {
      if (userID.toString() === item.owner.toString()) {
        const self = createSelf(`${req.protocol}://${req.get('host')}${req.originalUrl}`, req.method)
        const linkSelection: Links = {
          getItem: true,
          getItems: true,
          changeItem: true,
          addItem: true,
          deleteItem: true,
          logout: true,
          refresh: true
        }
        const paths = getAssociatedLinks(self, linkSelection)
        res.json({ item, paths })
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

  async deleteUserItem(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const { user } = req.body
    try {
      const userID = await getUserIDByEmail(user)
      const deletedItem = await deleteItem(id, userID)
      if (deletedItem) {
        res.sendStatus(204)
      } else {
        throw createError(404)
      }
    } catch (error) {
      next(error)
    }
    }

  async updateUserItem(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const { name, description, user } = req.body

    try {
      const userID = await getUserIDByEmail(user)

      if(userID) {
        const updates: UpdateItem = {
          name,
          description,
          userID
        }
        const item = await updateItem(id, updates)
        if (item) {
          const self = createSelf(`${req.protocol}://${req.get('host')}${req.originalUrl}`, req.method)
          const linkSelection: Links = {
            getItem: true,
            getItems: true,
            changeItem: true,
            deleteItem: true,
            logout: true,
            refresh: true
          }
          const paths = getAssociatedLinks(self, linkSelection)
          res.sendStatus(200)
        } else {
          throw createError(403)  
        }
      } else {
        throw createError(404)
      }
      
    } catch (error) {
      next(error)
    }
    
    }



}
