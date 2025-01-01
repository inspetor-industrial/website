import { clientEnv } from '@inspetor/env/client'
import axios from 'axios'
import { getSession } from 'next-auth/react'

const axiosApi = axios.create({
  baseURL: clientEnv.NEXT_PUBLIC_PDF_GENERATION_API,
})

axiosApi.interceptors.request.use(async (config) => {
  const session = await getSession({ req: config })
  config.headers.Authorization = `Bearer ${session?.user.firebaseToken}`

  return config
})

export { axiosApi }
