export enum LogType {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  SUCCESS = 'success',
}

export const logTypeColors = {
  [LogType.INFO]: '!text-blue-500',
  [LogType.WARN]: '!text-yellow-500',
  [LogType.ERROR]: '!text-red-500',
  [LogType.SUCCESS]: '!text-green-500',
}
