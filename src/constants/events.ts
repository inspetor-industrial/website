function buildEventName(name: string) {
  return `app:${name}`
}

export const events = {
  auth: {
    loginInProgress: buildEventName('login-in-progress'),
    loginFinished: buildEventName('login-finished'),
  },
  resetPassword: {
    sending: buildEventName('reset-password-email-sending'),
    sent: buildEventName('reset-password-email-sent'),
  },
  contact: {
    sending: buildEventName('contact-email-sending'),
    sent: buildEventName('contact-email-sent'),
  },
  loading: {
    finished: buildEventName('loading-finished'),
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
    manometers: {
      delete: buildEventName('manometer-delete'),
      generateReport: buildEventName('manometer-generate-report'),
      navigate: {
        to: {
          update: buildEventName('manometer-navigate-to-update'),
          detail: buildEventName('manometer-navigate-to-detail'),
          register: buildEventName('manometer-navigate-to-register'),
          preview: buildEventName('manometer-navigate-to-preview'),
        },
      },
    },
    boilerInspection: {
      delete: buildEventName('boiler-inspection-delete'),
      generateReport: buildEventName('boiler-inspection-generate-report'),
      navigate: {
        to: {
          update: buildEventName('boiler-inspection-navigate-table-to-update'),
          updateByToolbar: buildEventName(
            'boiler-inspection-navigate-toolbar-to-update',
          ),
          detail: buildEventName('boiler-inspection-navigate-to-detail'),
          register: buildEventName('boiler-inspection-navigate-to-register'),
          preview: buildEventName('boiler-inspection-navigate-to-preview'),
        },
      },
    },
    reports: {
      download: buildEventName('report-download'),
      delete: buildEventName('report-delete'),
    },
  },
} as const
