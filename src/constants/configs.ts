export const appConfigs = {
  limitOfQueries: 10,
  firestore: {
    emptyString: '__EMPTY__',
    searchProperty: 'search',
    permissions: {
      byCompanyPropertyName: 'companyOfUser',
    },
  },

  firebase: {
    auth: {
      clientErrors: {
        emailAlreadyInUse: 'auth/email-already-in-use',
      },
    },
    models: {
      status: {
        active: 'active',
        inactive: 'inactive',
      },
    },
  },

  functions: {
    delays: {
      default: 500, // 500ms
      short: 100, // 100ms
      long: 1000, // 1s
      medium: 300, // 300ms
    },
  },

  applicationName: 'Inspetor Industrial',
  defaultUsername: 'System',
} as const
