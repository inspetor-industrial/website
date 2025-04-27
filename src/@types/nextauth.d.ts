import { DefaultSession, DefaultUser } from 'next-auth'
import { AdapterUser as DefaultAdapterUser } from 'next-auth/adapters'

declare module 'next-auth/adapters' {
  interface AdapterUser extends DefaultAdapterUser {
    companyId: string
    firebaseToken: string
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      /** The user's unique ID */
      id: string

      companyId: string
      firebaseToken: string
      role: string
      profession: string
    } & DefaultSession['user']
  }

  // interface CallbacksOptions {
  //   session?: (
  //     params: {
  //       session: Session
  //       token: JWT
  //       user: AdapterUser
  //     } & {
  //       newSession: any
  //       trigger: 'update'
  //     },
  //   ) => Promise<Session | null>
  // }

  interface User extends DefaultUser {
    id: string
    companyId: string
    firebaseToken: string
    role: string
    profession: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    /** The user's unique ID */
    id: string
    companyId: string
    firebaseToken: string
    role: string
    profession: string
  }
}
