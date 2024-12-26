function buildEventName(name: string) {
  return `app:${name}`
}

export const events = {
  auth: {
    loginInProgress: buildEventName('login-in-progress'),
    loginFinished: buildEventName('login-finished'),
  },
  contact: {
    sending: buildEventName('contact-email-sending'),
    sent: buildEventName('contact-email-sent'),
  },
  models: {
    client: {
      delete: buildEventName('client-delete'),
      navigate: {
        to: {
          update: buildEventName('client-navigate-to-update'),
          detail: buildEventName('client-navigate-to-detail'),
          register: buildEventName('client-navigate-to-register'),
        },
      },
    },
    company: {
      delete: buildEventName('company-delete'),
      navigate: {
        to: {
          update: buildEventName('company-navigate-to-update'),
          detail: buildEventName('company-navigate-to-detail'),
          register: buildEventName('company-navigate-to-register'),
        },
      },
    },
    users: {
      delete: buildEventName('user-delete'),
      navigate: {
        to: {
          update: buildEventName('user-navigate-to-update'),
          detail: buildEventName('user-navigate-to-detail'),
          register: buildEventName('user-navigate-to-register'),
        },
      },
    },
    schedules: {
      delete: buildEventName('schedule-delete'),
      navigate: {
        to: {
          update: buildEventName('schedule-navigate-to-update'),
          detail: buildEventName('schedule-navigate-to-detail'),
          register: buildEventName('schedule-navigate-to-register'),
        },
      },
    },
    instruments: {
      delete: buildEventName('instrument-delete'),
      navigate: {
        to: {
          update: buildEventName('instrument-navigate-to-update'),
          detail: buildEventName('instrument-navigate-to-detail'),
          register: buildEventName('instrument-navigate-to-register'),
        },
      },
    },
    valves: {
      delete: buildEventName('valve-delete'),
      generateReport: buildEventName('valve-generate-report'),
      navigate: {
        to: {
          update: buildEventName('valve-navigate-to-update'),
          detail: buildEventName('valve-navigate-to-detail'),
          register: buildEventName('valve-navigate-to-register'),
          preview: buildEventName('valve-navigate-to-preview'),
        },
      },
    },
  },
} as const