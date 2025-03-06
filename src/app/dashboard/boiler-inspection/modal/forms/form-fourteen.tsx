import { zodResolver } from '@hookform/resolvers/zod'
import { NrSelect } from '@inspetor/components/nr-select'
import { TableQuestion } from '@inspetor/components/table-question'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '@inspetor/components/ui/form'
import { internalExamsNrs } from '@inspetor/constants/nrs'
import { nrValidator } from '@inspetor/utils/zod-validations/nr-validator'
import { forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  internalExamsTable: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    }),
  ),
  internalExamsTableNrs: nrValidator,
})

type Schema = z.infer<typeof schema>

type FormFourteenProps = {
  defaultValues?: Record<string, any>
}

export const internExamOfEquipmentQuestions = [
  {
    question: 'A CALDEIRA APRESENTA ALGUMA ANOMALIA INTERNAMENTE?',
    answer: '',
  },
  { question: 'ESTÁ COM OS TUBOS EM BOM ESTADO?', answer: '' },
  { question: 'ESTÁ COM OS TUBOS DEVIDAMENTE LIMPOS?', answer: '' },
  { question: 'OS TUBOS SÃO MANDRILHADOS?', answer: '' },
  { question: 'HÁ NECESSIDADE DE REMANDRILHAMENTO?', answer: '' },
  { question: 'A FORNALHA ENCONTRA-SE EM BOM ESTADO?', answer: '' },
  { question: 'ESTÁ DEVIDAMENTE LIMPA?', answer: '' },
  {
    question: 'AS PEDRAS DE RETORNO DE CHAMA ESTÃO EM BOM ESTADO?',
    answer: '',
  },
  { question: 'AS PASSAGENS DA CALDEIRA ESTÃO EM BOM ESTADO?', answer: '' },
  {
    question: 'INTERNAMENTE A CALDEIRA SATISFAZ A NBR16035-1/22 E NR13?',
    answer: '',
  },
  {
    question: 'FOI ENCONTRADO ALGO CAPAZ DE PREJUDICAR A SEGURANÇA?',
    answer: '',
  },
]

const FormFourteen = forwardRef(function FormFourteen(
  { defaultValues }: FormFourteenProps,
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
          internalExaminationsPerformed: {
            ...(defaultValues?.internalExaminationsPerformed ?? {}),
            tests: {
              questions: values.internalExamsTable,
              nrsToAdd: values.internalExamsTableNrs,
            },
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
          name="internalExamsTableNrs"
          render={({ field }) => (
            <FormItem className="flex justify-end">
              <FormControl>
                <NrSelect
                  onSelectNr={(nrs) => {
                    field.onChange(nrs)
                  }}
                  nrs={field.value ?? internalExamsNrs}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="internalExamsTable"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TableQuestion
                  options={field.value || internExamOfEquipmentQuestions}
                  onChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
})

export { FormFourteen }
