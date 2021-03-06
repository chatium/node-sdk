import { validateChatiumAppRequestToken } from './ChatiumAppRequestToken'
import { OptionalAuthCtx } from './ChatiumAuth'
import { OptionalUserCtx } from './ChatiumUser'
import { ApiError } from './errors'

export interface AppCtx {
  app: {
    apiKey: string
    apiSecret: string
  }
}

export interface AccountCtx {
  account: {
    id: number
    host: string
  }
}

export interface UniqCtx {
  uniqId: string | null
}

export function getChatiumContext(
  ctx: AppCtx,
  headers: ChatiumHeaders,
): AppCtx & UniqCtx & AccountCtx & OptionalAuthCtx & OptionalUserCtx {
  if (typeof headers['x-chatium-application'] !== 'string') {
    throw new ApiError('x-chatium-application header is required!')
  }

  const token = validateChatiumAppRequestToken(headers['x-chatium-application'], ctx.app.apiSecret)

  return {
    ...ctx,
    uniqId: token.uqid ? token.uqid : null,
    account: {
      id: token.acc,
      host: token.host,
    },
    auth: token.aid
      ? {
          id: token.aid,
          type: token.atp!,
          key: token.akey,
          requestToken: token.tkn!,
        }
      : null,
    user: token.uid
      ? {
          id: token.uid,
          roles: token.urs!,
          firstName: token.ufn || null,
          lastName: token.uln || null,
        }
      : null,
  }
}

export interface ChatiumHeaders {
  'x-chatium-application'?: string
}
