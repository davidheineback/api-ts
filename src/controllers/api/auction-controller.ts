import createError from 'http-errors'
import { Request, Response, NextFunction } from 'express'
import { getAssociatedLinks, Links, Self } from '../../helpers/hateoas'
import { getUserIDByEmail } from '../../repository/user-repository'
import { getItemFrom } from '../../repository/item-repository'
import { addAuction } from '../../repository/auction-repository'
import { AuctionInterface } from '../../models/AuctionModel'

/**
 * Encapsulates a controller.
 */
export class AuctionController {

index (req: Request, res: Response, next: NextFunction) {
  const self: Self =  {
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

async createAuction (req: Request, res: Response, next: NextFunction) {
  const { user, itemID, initialPrice, expires } = req.body
  const userID = await getUserIDByEmail(user)
  const item = await getItemFrom(itemID)
  
  if (item) {
    if (item.owner.toString() === userID.toString()) {
      const data: AuctionInterface = {
          item,
          initialPrice,
          expires,
      }
  
      const auction = await addAuction(data)
      console.log(auction)
    }
  }




  console.log('Hello from Auction index')
  const self: Self =  {
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
