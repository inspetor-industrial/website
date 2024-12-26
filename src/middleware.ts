import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

import { serverEnv } from './env/server'

export async function middleware(request: NextRequest) {
  try {
    const response = NextResponse.next()
    const userAgent = request.headers.get('user-agent') || ''
    const isMobile =
      /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile/i.test(userAgent)

    if (isMobile && !request.nextUrl.pathname.includes('download-mobile')) {
      return NextResponse.redirect(
        new URL('/download-mobile', request.nextUrl.clone()),
      )
    }

    const protectedRoutes = ['/dashboard']
    const isProtectedRoute = protectedRoutes.some((protectedRoute) =>
      request.nextUrl.pathname.startsWith(protectedRoute),
    )
    if (isProtectedRoute) {
      const token = await getToken({
        req: request,
        secret: serverEnv.NEXTAUTH_SECRET,
      })

      if (!token) {
        return NextResponse.redirect(
          new URL('/auth/sign-in', request.nextUrl.clone()),
        )
      }
    }

    return response
  } catch {
    return NextResponse.redirect(
      new URL('/auth/sign-in', request.nextUrl.clone()),
    )
  }
}

export const config = { matcher: ['/:path*'] }
