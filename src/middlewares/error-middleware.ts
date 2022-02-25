import { NextFunction, Request, Response } from 'express';
import HttpError from "../errors/HttpError"
import { createSelf, getAssociatedLinks, Links } from '../helpers/hateoas'

export const errorMiddleware = (err: HttpError, req: Request, res: Response, next: NextFunction) => {
  err.status = err.status || 500
  const self = createSelf(`${req.protocol}://${req.get('host')}/api/auth`, req.method)
  let refresh = false

  err.status === 401 && (refresh = true)

  const linkSelection: Links = {
    refresh,
    register: true,
    login: true,
  }
  const entry = `${req.protocol}://${req.get('host')}`
  const paths = getAssociatedLinks(self, linkSelection, entry)

  if (req.app.get('env') !== 'development') {
    res.status(err.status).json({
      status: err.status,
      message: err.message,
      entry: `${req.protocol}://${req.get('host')}/api`,
      paths
    })
    return
  }



  return res.status(err.status).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    entry: `${req.protocol}://${req.get('host')}/api`,
    paths
  })

}