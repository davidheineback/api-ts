import { NextFunction, Request, Response } from 'express';
import HttpError from "../errors/HttpError"

export const errorMiddleware = (err: HttpError, req: Request, res: Response, next: NextFunction) => {
  err.status = err.status || 500

  if (req.app.get('env') !== 'development') {
    res.status(err.status).json({
      status: err.status,
      message: err.message
    })
    return
  }

  return res.status(err.status).json({
    status: err.status,
    message: err.message,
    stack: err.stack
  })

}