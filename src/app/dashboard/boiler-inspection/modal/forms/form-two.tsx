'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@inspetor/components/ui/form'
import { Input } from '@inspetor/components/ui/input'
import { dayjsApi, defaultLocaleForAntd } from '@inspetor/lib/dayjs'
import { ConfigProvider, DatePicker, TimePicker } from 'antd'
import { forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  date: z.number(),
  startTimeInspection: z.any().transform((value) => value.toDate().getTime()),
  endTimeInspection: z.any().transform((value) => value.toDate().getTime()),

  validity: z.string(),
  nextDate: z.number(),
})

type Schema = z.infer<typeof schema>

type FormTwoProps = {
  defaultValues?: Record<string, any>
}

const FormTwo = forwardRef(function FormTwo(
  { defaultValues }: FormTwoProps,
  ref,
) {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...defaultValues,
      startTimeInspection: defaultValues?.startTimeInspection
        ? dayjsApi(new Date(defaultValues.startTimeInspection))
        : undefined,
      endTimeInspection: defaultValues?.endTimeInspection
        ? dayjsApi(new Date(defaultValues.endTimeInspection))
        : undefined,
    },
  })

  useImperativeHandle(ref, () => {
    return {
      getValues: form.getValues,
      runAutoCompleteAndFormatterWithDefaultValues: (values: Schema) => {
        return values
      },
      form,
    }
  })

  return (
    <Form {...form}>
      <form className="space-y-2.5">
        <FormField
          name="date"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Data da inspeção</FormLabel>
                <FormControl>
                  <ConfigProvider locale={defaultLocaleForAntd}>
                    <DatePicker
                      className="w-full h-10 !bg-inspetor-gray-300"
                      format={{
                        format: 'YYYY-MM-DD',
                        type: 'mask',
                      }}
                      pickerValue={dayjsApi(new Date(field.value))}
                      onPickerValueChange={(value) =>
                        field.onChange(value.toDate().getTime())
                      }
                    />
                  </ConfigProvider>
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />

        <FormField
          name="startTimeInspection"
          control={form.control}
          render={({ field }) => {
            console.log(field.value)
            console.log(new Date(field.value))
            console.log(dayjsApi(new Date(field.value)))

            return (
              <FormItem>
                <FormLabel>Horário de início</FormLabel>
                <FormControl>
                  <ConfigProvider locale={defaultLocaleForAntd}>
                    <TimePicker
                      className="w-full h-10 !bg-inspetor-gray-300"
                      format={{
                        format: 'HH:mm',
                        type: 'mask',
                      }}
                      needConfirm
                      {...field}
                    />
                  </ConfigProvider>
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />

        <FormField
          name="endTimeInspection"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Horário do término</FormLabel>
                <FormControl>
                  <ConfigProvider locale={defaultLocaleForAntd}>
                    <TimePicker
                      className="w-full h-10 !bg-inspetor-gray-300"
                      format={{
                        format: 'HH:mm',
                        type: 'mask',
                      }}
                      needConfirm
                      {...field}
                    />
                  </ConfigProvider>
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <FormField
          name="validity"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Validade da inspeção</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <FormField
          name="nextDate"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Data da próxima inspeção</FormLabel>
                <FormControl>
                  <ConfigProvider locale={defaultLocaleForAntd}>
                    <DatePicker
                      className="w-full h-10 !bg-inspetor-gray-300"
                      format={{
                        format: 'YYYY-MM-DD',
                        type: 'mask',
                      }}
                      pickerValue={dayjsApi(new Date(field.value))}
                      onPickerValueChange={(value) =>
                        field.onChange(value.toDate().getTime())
                      }
                    />
                  </ConfigProvider>
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />
      </form>
    </Form>
  )
})

export { FormTwo }
