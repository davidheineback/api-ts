import createError from 'http-errors'
import { Request, Response, NextFunction } from 'express'
import { getAccessAndRefreshToken, verifyRefreshToken, verifyAccessToken } from './method-controller'
import { addUser, authorizeUser } from '../../repository/user-repository'
import { TokenInterface } from '../../models/TokenModel'
import { setToken, deleteToken, getTokenByEmail, getRefreshToken } from '../../repository/token-repository'
import { getAssociatedLinks, Links } from '../../helpers/hateoas'

/**
 * Encapsulates a controller.
 */
export class AuctionController {

index (req: Request, res: Response, next: NextFunction) {
  console.log(req.params)
  console.log('Hello from Auction index')
  const self =  `${req.protocol}://${req.get('host')}${req.originalUrl}`
    const linkSelection: Links = {
      register: true,
      login: true,
    }

const paths = getAssociatedLinks(self, linkSelection)
// console.log(paths)

  res.json({ message: 'Authentication operations:', links: paths })
}


}
