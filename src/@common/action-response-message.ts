type DefaultActionMessage<TypeOfAdditionalProperties = any> =
  TypeOfAdditionalProperties & {
    message: string
    success?: boolean
  }

export function returnsDefaultActionMessage<AdditionalProperties>({
  message,
  success = false,
  ...others
}: DefaultActionMessage<AdditionalProperties>) {
  return {
    message,
    success,
    others,
  }
}
