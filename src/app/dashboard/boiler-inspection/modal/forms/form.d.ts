'use client'

import { useForm } from 'react-hook-form'

type Schema = any

export type FormRef = {
  getValues: () => Schema
  runAutoCompleteAndFormatterWithDefaultValues?: (values: Schema) => Schema
  form: ReturnType<typeof useForm>
}

// import { ElementType } from 'react'

// export type FieldProps = {
//   value?: any
//   onChange: (value: any) => void
//   disabled?: boolean
// }

// export type FieldSchema = {
//   id: string
//   name: string
//   required: boolean
//   component: ElementType<FieldProps>
// }

// export type FormSchema = {
//   id: string
//   title: string
//   fields: FieldSchema[]
// }
