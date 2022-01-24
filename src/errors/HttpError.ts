export default class HttpError extends Error {
  status: number
  message: string
  stack: string | undefined

  constructor(status: number, message: string) {
    super(message)
    this.message = message
    this.status = status
    this.stack = super.stack
  }
}