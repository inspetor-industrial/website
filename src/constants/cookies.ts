function buildCookieKey(key: string) {
  return `inspetor-industrial-${key}-v2`
}

export const cookieKeys = {
  auth: {
    token: buildCookieKey('auth-token'),
    user: {
      username: buildCookieKey('auth-user-username'),
      email: buildCookieKey('auth-user-email'),
      id: buildCookieKey('auth-user-id'),
    },
  },
} as const
