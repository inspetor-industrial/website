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
import { nrsForMeasurementsLevelIndicatorSet } from '@inspetor/constants/nrs'
import { nrValidator } from '@inspetor/utils/zod-validations/nr-validator'
import { forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const tableLevelIndicatorQuestions = [
  {
    question: 'O CONJUNTO INDICADOR DE NÍVEL ESTÁ EM CONDIÇÕES DE USO?',
    answer: '',
  },
  {
    question: 'A VÁLVULA DE DESCARGA FUNCIONA NORMALMENTE?',
    answer: '',
  },
  { question: 'HÁ NECESSIDADE DE TROCA DO CONJUNTO?', answer: '' },
  {
    question: 'O VIDRO ENCONTRA-SE EM CONDIÇÕES DE USO?',
    answer: '',
  },
  {
    question: 'AS BORRACHAS DE VEDAÇÃO ENCONTRAM-SE EM CONDIÇÕES DE USO?',
    answer: '',
  },
]

const schema = z.object({
  levelIndicatorTests: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
      }),
    )
    .optional()
    .default([]),
  levelIndicatorNrs: nrValidator,
  observationsLevelIndicator: z.string().optional().default(''),
})

type Schema = z.infer<typeof schema>

type FormTwentyFiveProps = {
  defaultValues?: Record<string, any>
}

const FormTwentyFive = forwardRef(function FormTwentyFive(
  { defaultValues }: FormTwentyFiveProps,
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
          calibrationOfTheLevelIndicatorAssembly: {
            ...(defaultValues?.calibrationOfTheLevelIndicatorAssembly ?? {}),
            tests: {
              questions: values.levelIndicatorNrs,
              nrsToAdd: values.levelIndicatorTests,
            },

            observations: values.observationsLevelIndicator,
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
          name="levelIndicatorNrs"
          render={({ field }) => (
            <FormItem className="flex justify-end">
              <FormControl>
                <NrSelect
                  onSelectNr={(nrs) => {
                    field.onChange(nrs)
                  }}
                  nrs={field.value ?? nrsForMeasurementsLevelIndicatorSet}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="levelIndicatorTests"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TableQuestion
                  options={field.value || tableLevelIndicatorQuestions}
                  onChange={field.onChange}
                  // extraLogicOnChange={handleTableExamsApplyNrsLogic}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="observationsLevelIndicator"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Observações:</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="w-full h-20 p-2 border border-gray-300 rounded-md"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
})

export { FormTwentyFive }
