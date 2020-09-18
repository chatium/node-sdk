export interface ChatiumAuth {
  id: number
  type: ChatiumAuthType
  requestToken: string
}

export interface AuthCtx {
  auth: ChatiumAuth
}

export interface OptionalAuthCtx {
  auth: ChatiumAuth | null
}

export enum ChatiumAuthType {
  Email = 'Email',
  None = 'None',
  Phone = 'Phone',
  Session = 'Session',
}
