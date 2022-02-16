import createError from 'http-errors'
import { Request, Response, NextFunction } from 'express'
import { getAssociatedLinks, Links, Self } from '../../helpers/hateoas'

/**
 * Encapsulates a controller.
 */
export class ItemController {

index (req: Request, res: Response, next: NextFunction) {
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

  res.json({ message: 'Authentication operations:', links: paths })
}


}
