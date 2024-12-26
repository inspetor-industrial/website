import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const serverEnv = createEnv({
  server: {
    NEXTAUTH_SECRET: z.string(),
    AUTH_FIREBASE_PROJECT_ID: z.string(),
    AUTH_FIREBASE_PRIVATE_KEY: z.string(),
    AUTH_FIREBASE_CLIENT_EMAIL: z.string(),

    FIREBASE_API_KEY: z.string(),
    FIREBASE_AUTH_DOMAIN: z.string(),
    FIREBASE_PROJECT_ID: z.string(),
    FIREBASE_STORAGE_BUCKET: z.string(),
    FIREBASE_MESSAGING_SENDER_ID: z.string(),
    FIREBASE_APP_ID: z.string(),
    FIREBASE_MEASUREMENT_ID: z.string(),
  },
  // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
  // runtimeEnv: {
  //   DATABASE_URL: process.env.DATABASE_URL,
  //   OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY,
  // },
  // For Next.js >= 13.4.4, you can just reference process.env:
  experimental__runtimeEnv: process.env,
})
