import { initFirestore as initializeFirestore } from '@auth/firebase-adapter'
import { serverEnv } from '@inspetor/env/server'
import * as firebaseApp from 'firebase/app'
import * as firebaseAuth from 'firebase/auth'
import { AppOptions, cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'

const firebaseConfig: AppOptions = {
  credential: cert({
    projectId: serverEnv.AUTH_FIREBASE_PROJECT_ID,
    clientEmail: serverEnv.AUTH_FIREBASE_CLIENT_EMAIL,
    privateKey: serverEnv.AUTH_FIREBASE_PRIVATE_KEY,
  }),
}

const firebaseClientConfig = {
  apiKey: serverEnv.FIREBASE_API_KEY,
  authDomain: serverEnv.FIREBASE_AUTH_DOMAIN,
  projectId: serverEnv.FIREBASE_PROJECT_ID,
  storageBucket: serverEnv.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: serverEnv.FIREBASE_MESSAGING_SENDER_ID,
  appId: serverEnv.FIREBASE_APP_ID,
  measurementId: serverEnv.FIREBASE_MEASUREMENT_ID,
}

export const getFirebaseApps = () => {
  try {
    const existingApps = getApps()
    const existingFirebaseClientApps = firebaseApp.getApps()

    let app: ReturnType<typeof initializeApp>
    let firebaseClientApp: ReturnType<typeof firebaseApp.initializeApp>

    if (existingApps.length > 0) {
      app = existingApps[0]
    } else {
      app = initializeApp(firebaseConfig)
    }

    if (existingFirebaseClientApps.length > 0) {
      firebaseClientApp = existingFirebaseClientApps[0]
    } else {
      firebaseClientApp = firebaseApp.initializeApp(firebaseClientConfig)
    }

    const auth = getAuth(app)
    const firestore = getFirestore(app)
    const storage = getStorage(app)

    const clientAuth = firebaseAuth.getAuth(firebaseClientApp)

    return { app, auth, firestore, storage, clientAuth, firebaseClientApp }
  } catch (error) {
    return null
  }
}

export function initFirestore() {
  return initializeFirestore({
    credential: cert({
      projectId: serverEnv.AUTH_FIREBASE_PROJECT_ID,
      clientEmail: serverEnv.AUTH_FIREBASE_CLIENT_EMAIL,
      privateKey: serverEnv.AUTH_FIREBASE_PRIVATE_KEY,
    }),
  })
}
