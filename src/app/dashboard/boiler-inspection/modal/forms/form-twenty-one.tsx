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
import { nrsForSecurityMeasurementContinuation } from '@inspetor/constants/nrs'
import { nrValidator } from '@inspetor/utils/zod-validations/nr-validator'
import { forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  injectorTests: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    }),
  ),
  injectorNrs: nrValidator,
  observationsInjector: z.string().optional().default(''),
})

type Schema = z.infer<typeof schema>

type FormTwentyOneProps = {
  defaultValues?: Record<string, any>
}

export const securityMeasurementContinuation = [
  { question: 'O INJETOR DE VALOR FOI AFERIDO?', answer: '' },
  { question: 'FUNCIONA NORMALMENTE?', answer: '' },
  { question: 'HÁ ALGUM PROBLEMA NO MESMO?', answer: '' },
  {
    question: 'HÁ SISTEMA DE RETENÇÃO PARA PROTEÇÃO DO MECANISMO INTERNO?',
    answer: '',
  },
  { question: 'A LIGAÇÃO DE ÁGUA FOI FEITA CORRETAMENTE?', answer: '' },
]

const FormTwentyOne = forwardRef(function FormTwentyOne(
  { defaultValues }: FormTwentyOneProps,
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
          injectorGauge: {
            ...(defaultValues?.injectorGauge ?? {}),
            tests: {
              questions: values.injectorTests,
              nrsToAdd: values.injectorNrs,
            },
            observations: values.observationsInjector,
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
          name="injectorNrs"
          render={({ field }) => (
            <FormItem className="flex justify-end">
              <FormControl>
                <NrSelect
                  onSelectNr={(nrs) => {
                    field.onChange(nrs)
                  }}
                  nrs={field.value ?? nrsForSecurityMeasurementContinuation}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="injectorTests"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TableQuestion
                  options={field.value || securityMeasurementContinuation}
                  onChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="observationsInjector"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
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

export { FormTwentyOne }
