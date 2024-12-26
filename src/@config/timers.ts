export const TIMERS_CONFIG = {
  toast: {
    durations: {
      short: 1_000, // 1 second
      medium: 2_500, // 2.5 second
      long: 5_000, // 5 second
      longest: 10_000, // 10 second
    },
    default: 2_500, // 1.5 second
  },
} as const
