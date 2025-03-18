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
import { buildTimeDate } from '@inspetor/utils/build-time-date'
import { ConfigProvider, DatePicker, TimePicker } from 'antd'
import { forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  date: z.number(),
  startTimeInspection: z.any(),
  endTimeInspection: z.any(),

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
        ? dayjsApi(buildTimeDate(defaultValues.startTimeInspection))
        : undefined,
      endTimeInspection: defaultValues?.endTimeInspection
        ? dayjsApi(buildTimeDate(defaultValues.endTimeInspection))
        : undefined,
    },
  })

  useImperativeHandle(ref, () => {
    return {
      getValues: form.getValues,
      runAutoCompleteAndFormatterWithDefaultValues: (values: Schema) => {
        return {
          ...defaultValues,
          ...values,
        }
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
                <FormLabel className="text-zinc-50">Data da inspeção</FormLabel>
                <FormControl>
                  <ConfigProvider locale={defaultLocaleForAntd}>
                    <DatePicker
                      className="w-full h-10 !bg-inspetor-gray-300"
                      format={{
                        format: 'YYYY-MM-DD',
                        type: 'mask',
                      }}
                      value={dayjsApi(new Date(field.value))}
                      defaultPickerValue={dayjsApi(new Date(field.value))}
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
            return (
              <FormItem>
                <FormLabel className="text-zinc-50">
                  Horário de início
                </FormLabel>
                <FormControl>
                  <ConfigProvider locale={defaultLocaleForAntd}>
                    <TimePicker
                      className="w-full h-10 !bg-inspetor-gray-300"
                      format={{
                        format: 'HH:mm',
                        type: 'mask',
                      }}
                      value={
                        field.value ? dayjsApi(field.value, 'HH:mm') : undefined
                      }
                      onChange={(_value, timeString) =>
                        field.onChange(timeString)
                      }
                      needConfirm
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
                <FormLabel className="text-zinc-50">
                  Horário do término
                </FormLabel>
                <FormControl>
                  <ConfigProvider locale={defaultLocaleForAntd}>
                    <TimePicker
                      className="w-full h-10 !bg-inspetor-gray-300"
                      format={{
                        format: 'HH:mm',
                        type: 'mask',
                      }}
                      value={
                        field.value ? dayjsApi(field.value, 'HH:mm') : undefined
                      }
                      onChange={(_value, timeString) =>
                        field.onChange(timeString)
                      }
                      needConfirm
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
                <FormLabel className="text-zinc-50">
                  Validade da inspeção
                </FormLabel>
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
                <FormLabel className="text-zinc-50">
                  Data da próxima inspeção
                </FormLabel>
                <FormControl>
                  <ConfigProvider locale={defaultLocaleForAntd}>
                    <DatePicker
                      className="w-full h-10 !bg-inspetor-gray-300"
                      format={{
                        format: 'YYYY-MM-DD',
                        type: 'mask',
                      }}
                      value={dayjsApi(new Date(field.value))}
                      defaultPickerValue={dayjsApi(new Date(field.value))}
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
