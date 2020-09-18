export abstract class ChatiumError extends Error {
  abstract readonly statusCode: number
}

export class NotFoundError extends ChatiumError {
  readonly statusCode = 404
  constructor(readonly type: string, readonly id: string | number) {
    super(`'${id}' is not found in '${type}'`)
  }
}

export class AuthRequiredError extends ChatiumError {
  readonly statusCode = 401
  constructor(reason?: string) {
    super('Authentication required!' + (reason ? ' Reason: ' + reason : ''))
  }
}

export class AccessDeniedError extends ChatiumError {
  readonly statusCode = 403
  readonly type: string | undefined
  readonly id: string | number | undefined
  readonly action: string | undefined
  readonly reason: string | undefined

  constructor(message: string)
  constructor(type: string, id: string | number, action?: string, reason?: string)
  constructor(...args: any[]) {
    super(
      args.length === 0
        ? 'Access denied!'
        : args.length === 1
        ? args[0]
        : args.length === 2
        ? `Access denied to ${args[0]}[${args[1]}]`
        : args.length === 3
        ? `Access denied to ${args[0]}[${args[1]}] (${args[2]})`
        : `Access denied to ${args[0]}[${args[1]}] (${args[2]}). ` +
          `Reason: ${args[3]}`,
    )
    if (args.length > 1) {
      this.type = args[0]
      this.id = args[1]
      this.action = args[2]
      this.reason = args[3]
    }
  }
}

export class ApiError extends ChatiumError {
  readonly statusCode = 400
}

export class WrongArgumentError extends ChatiumError {
  readonly statusCode = 500
  constructor(reason?: string) {
    super('Wrong argument error!' + (reason ? ' Reason: ' + reason : ''))
  }
}
