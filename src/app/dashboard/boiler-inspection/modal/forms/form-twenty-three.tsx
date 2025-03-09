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
import { nrsForBombsSupply } from '@inspetor/constants/nrs'
import { nrValidator } from '@inspetor/utils/zod-validations/nr-validator'
import { forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const tableBombsQuestions = [
  {
    question: 'FOI REALIZADO?',
    answer: '',
  },
  {
    question: 'A BOMBA ENCONTRA-SE FUNCIONANDO NORMALMENTE?',
    answer: '',
  },
  {
    question: 'É SUFICIENTE PARA SUPORTAR A PRESSÃO DE USO DO EQUIPAMENTO?',
    answer: '',
  },
  {
    question: 'FOI OBSERVADA ALGUMA ANOMALIA CAPAZ DE PREJUDICAR A SEGURANÇA?',
    answer: '',
  },
  {
    question: 'HOUVE ALGUM OUTRO PROBLEMA RELACIONADO Á PRESSÃO APLICADA?',
    answer: '',
  },
]

const schema = z.object({
  bombsTests: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    }),
  ),
  bombsNrs: nrValidator,
  observationsPowerSupply: z.string().optional().default(''),
})

type Schema = z.infer<typeof schema>

type FormTwentyThreeProps = {
  defaultValues?: Record<string, any>
}

const FormTwentyThree = forwardRef(function FormTwentyThree(
  { defaultValues }: FormTwentyThreeProps,
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
          powerSupply: {
            ...(defaultValues?.powerSupply ?? {}),
            tests: {
              questions: values.bombsTests,
              nrsToAdd: values.bombsNrs,
            },

            observations: values.observationsPowerSupply,
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
          name="bombsNrs"
          render={({ field }) => (
            <FormItem className="flex justify-end">
              <FormControl>
                <NrSelect
                  onSelectNr={(nrs) => {
                    field.onChange(nrs)
                  }}
                  nrs={field.value ?? nrsForBombsSupply}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bombsTests"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TableQuestion
                  options={field.value || tableBombsQuestions}
                  onChange={field.onChange}
                  // extraLogicOnChange={handleTableExamsApplyNrsLogic}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="observationsPowerSupply"
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

export { FormTwentyThree }
