import { FirestoreAdapter } from '@auth/firebase-adapter'
import { firebaseModels } from '@inspetor/constants/firebase-models'
import {
  signInWithCustomToken,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import { getFirebaseApps, initFirestore } from '../firebase/server'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      authorize: async (credentials) => {
        const username = credentials?.username
        const password = credentials?.password

        if (!username || !password) {
          return null
        }

        const firebase = getFirebaseApps()
        if (!firebase) {
          return null
        }

        const userOnFirebase = await firebase.auth.getUserByEmail(username)
        if (!userOnFirebase) {
          return null
        }

        const response = await signInWithEmailAndPassword(
          firebase.clientAuth,
          username,
          password,
        )

        const hasSignedIn = !!response.user
        if (hasSignedIn) {
          const tokenId = await response.user.getIdToken(true)

          const userProfile = await firebase.firestore
            .collection(firebaseModels.users)
            .doc(userOnFirebase.uid)
            .get()

          const profile = userProfile.data()

          return {
            id: response.user.uid,
            name:
              response.user.displayName ||
              response.user.email?.replace(/@.+/, '') ||
              'Usuário desconhecido',
            companyId: profile?.companyId ?? 'unknown',
            email: response.user.email,
            image: response.user.photoURL,
            firebaseToken: tokenId,
            role: profile?.role ?? 'user',
            profession: profile?.profession ?? 'unknown',
          }
        }

        return null
      },
      credentials: {
        username: { label: 'E-mail', type: 'text' },
        password: { label: 'Senha', type: 'password' },
      },
    }),
  ],
  // @ts-expect-error [ignore]
  adapter: FirestoreAdapter(initFirestore()),
  callbacks: {
    jwt: async ({ token, user }) => {
      // Adicione o ID do usuário ao token se ele estiver disponível
      if (user) {
        token.id = user.id
        token.companyId = user.companyId
        token.firebaseToken = user.firebaseToken
        token.role = user.role
        token.profession = user.profession

        const firebase = getFirebaseApps()
        if (!firebase) {
          return token
        }

        const firebaseToken = await firebase.auth.createCustomToken(user.id)
        user.firebaseToken = firebaseToken
      }

      return token
    },

    session: async ({ session, token }) => {
      // Adicione o ID do usuário à sessão
      // TODO: check company of user

      if (token.id) {
        session.user.id = token.id
        session.user.companyId = token.companyId
        session.user.firebaseToken = token.firebaseToken
        session.user.role = token.role
        session.user.profession = token.profession
      }

      const firebase = getFirebaseApps()
      if (!firebase) {
        return session
      }

      const firebaseToken = await firebase.auth.createCustomToken(
        session.user.id,
      )

      const userLogged = await signInWithCustomToken(
        firebase.clientAuth,
        firebaseToken,
      )

      session.user.firebaseToken = await userLogged.user.getIdToken(true)

      return session
    },
  },
  session: {
    strategy: 'jwt',
  },
  // pages: {
  //   signIn: '/auth/sign-in',
  //   signOut: '/auth/sign-out',
  // },
}

export const handler = NextAuth(authOptions)
