import { NextFunction, Request, Response } from 'express';
import HttpError from "../errors/HttpError"
import { createSelf, getAssociatedLinks, Links } from '../helpers/hateoas'

export const errorMiddleware = (err: HttpError, req: Request, res: Response, next: NextFunction) => {
  err.status = err.status || 500
  const self = createSelf(`${req.protocol}://${req.get('host')}/api/auth`, req.method)
  const linkSelection: Links = {
    refresh: true,
    register: true,
    login: true,
  }
  const paths = getAssociatedLinks(self, linkSelection)

  if (req.app.get('env') !== 'development') {
    res.status(err.status).json({
      status: err.status,
      message: err.message,
      paths
    })
    return
  }



  return res.status(err.status).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    paths
  })

}