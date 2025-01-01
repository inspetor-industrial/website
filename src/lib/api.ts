import { clientEnv } from '@inspetor/env/client'
import axios from 'axios'

import { auth } from './firebase/client'

const axiosApi = axios.create({
  baseURL: clientEnv.NEXT_PUBLIC_PDF_GENERATION_API,
})

axiosApi.interceptors.request.use(async (config) => {
  const currentUserLoggedInFirebaseAuth = auth.currentUser
  if (currentUserLoggedInFirebaseAuth) {
    const token = await currentUserLoggedInFirebaseAuth.getIdToken(true)
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
