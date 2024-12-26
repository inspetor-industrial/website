import { DefaultSession, DefaultUser } from 'next-auth'
import { AdapterUser as DefaultAdapterUser } from 'next-auth/adapters'

declare module 'next-auth/adapters' {
  interface AdapterUser extends DefaultAdapterUser {
    companyId: string
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      /** The user's unique ID */
      id: string

      companyId: string
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    id: string
    companyId: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    /** The user's unique ID */
    id: string
    companyId: string
  }
}
