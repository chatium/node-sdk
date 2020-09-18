import { verify } from 'jsonwebtoken'
import { ApiError } from './errors'
import {ChatiumUserRole} from './ChatiumUser'
import {ChatiumAuthType} from './ChatiumAuth'

export interface ChatiumAppRequestToken {
  acc: number
  host: string
  aid?: number
  atp?: ChatiumAuthType
  tkn?: string
  uid?: string
  ufn?: string
  uln?: string
  urs?: ChatiumUserRole[]
}

export function validateChatiumAppRequestToken(token: string, secret: string): ChatiumAppRequestToken {
  const raw: any = verify(token, secret)

  if (typeof raw.iat !== 'number' || raw.iat + requestTokenExpirationSeconds < Math.round(Date.now() / 1000)) {
    throw new ApiError('Chatium app token is expired')
  }

  if (
    typeof raw.acc === 'number' &&
    typeof raw.host === 'string' &&
    (!raw.aid || (typeof raw.aid === 'number' && typeof raw.tkn === 'string' && typeof raw.atp === 'string')) &&
    (!raw.uid ||
      (typeof raw.uid === 'string' &&
        Array.isArray(raw.urs) &&
        (!raw.ufn || typeof raw.ufn === 'string') &&
        (!raw.uln || typeof raw.uln === 'string')))
  ) {
    return raw
  } else {
    throw new ApiError('Invalid chatium app token')
  }
}

const requestTokenExpirationSeconds = 5 * 60 // 5 minutes
