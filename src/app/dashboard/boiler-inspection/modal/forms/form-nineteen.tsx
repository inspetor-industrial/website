import { zodResolver } from '@hookform/resolvers/zod'
import { NrSelect } from '@inspetor/components/nr-select'
import { TableQuestion } from '@inspetor/components/table-question'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@inspetor/components/ui/form'
import { Textarea } from '@inspetor/components/ui/textarea'
import { nrsForSecurityMeasurement } from '@inspetor/constants/nrs'
import { nrValidator } from '@inspetor/utils/zod-validations/nr-validator'
import { forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  pressureGaugeCalibrationTests: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
      }),
    )
    .optional()
    .default([]),
  pressureGaugeCalibrationNrs: nrValidator,
  observationsPressureGauge: z.string().optional().default(''),
})

type Schema = z.infer<typeof schema>

type FormNineteenProps = {
  defaultValues?: Record<string, any>
}

export const measurementSecurityQuestions = [
  { question: 'O MANÔMETRO FOI CALIBRADO?', answer: '' },
  { question: 'FUNCIONA NORMALMENTE?', answer: '' },
  { question: 'HÁ ALGUM PROBLEMA NO MESMO?', answer: '' },
  { question: 'HÁ SIFÃO PARA PROTEÇÃO DO MECANISMO INTERNO?', answer: '' },
  { question: 'O VIDRO ENCONTRA-SE COM VISIBILIDADE ADEQUADA?', answer: '' },
]

const FormNineteen = forwardRef(function FormNineteen(
  { defaultValues }: FormNineteenProps,
  ref,
) {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  useImperativeHandle(ref, () => {
    return {
      getValues: form.getValues,
      runAutoCompleteAndFormatterWithDefaultValues: (values: Schema) => {
        return {
          ...values,
          pressureGaugeCalibration: {
            ...(defaultValues?.pressureGaugeCalibration ?? {}),
            tests: {
              questions: values.pressureGaugeCalibrationTests,
              nrsToAdd: values.pressureGaugeCalibrationNrs,
            },
            observations: values.observationsPressureGauge,
          },
        }
      },
      form,
    }
  })

  return (
    <Form {...form}>
      <form className="space-y-2.5 max-w-[462px]">
        <FormField
          control={form.control}
          name="pressureGaugeCalibrationNrs"
          render={({ field }) => (
            <FormItem className="flex justify-end">
              <FormControl>
                <NrSelect
                  onSelectNr={(nrs) => {
                    field.onChange(nrs)
                  }}
                  nrs={field.value ?? nrsForSecurityMeasurement}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pressureGaugeCalibrationTests"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TableQuestion
                  options={field.value || measurementSecurityQuestions}
                  onChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="observationsPressureGauge"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-50">Observações</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
})

export { FormNineteen }
