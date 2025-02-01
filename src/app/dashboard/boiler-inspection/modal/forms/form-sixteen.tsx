import { zodResolver } from '@hookform/resolvers/zod'
import { NrSelect } from '@inspetor/components/nr-select'
import { TableQuestion } from '@inspetor/components/table-question'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '@inspetor/components/ui/form'
import { nrsLocalInstallationBoiler } from '@inspetor/constants/nrs'
import { nrValidator } from '@inspetor/utils/zod-validations/nr-validator'
import { forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  testsLocalInstallation: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    }),
  ),
  nrsLocalInstallation: nrValidator,
})

type Schema = z.infer<typeof schema>

type FormSixteenProps = {
  defaultValues?: Record<string, any>
}

export const questionsAboutInstallationLocal = [
  { question: 'POSSUI PROJETO DE INSTALAÇÃO?', answer: '' },
  {
    question: 'O PROJETO ATENDE AOS REQUISITOS MÍNIMOS DA NR13?',
    answer: '',
  },
  { question: 'ATENDE AO ITEM 13.4.2.3 OU 13.4.2.4 DA NR13?', answer: '' },
  {
    question: 'CONSTITUI PRÉDIO SEPARADO DE MATERIAL RESISTENTE AO CALOR?',
    answer: '',
  },
  {
    question: 'DISPÕE DE PELO MENOS 2 SAÍDAS AMPLAS E SINALIZADAS?',
    answer: '',
  },
  { question: 'DISPÕE DE VENTILAÇÃO PERMANENTE?', answer: '' },
  { question: 'ENTRADAS DE AR NÃO BLOQUEÁVEIS?', answer: '' },
  { question: 'DISPÕE DE SENSOR DE VAZAMENTO DED GASES?', answer: '' },
  { question: 'A CASA É UTILIZADA PARA OUTRA FINALIDADE?', answer: '' },
  { question: 'DISPÕE DE ACESSO FÁCIL E SEGURO?', answer: '' },
  { question: 'TEM SISTEMA DE CAPTAÇÃO E LANÇAMENTO DE GASES?', answer: '' },
  { question: 'POSSUI RELATÓRIO DE EMISSÃO DE GASES?', answer: '' },
  { question: 'DISPÕE DE ILUMINAÇÃO SEGUNDO NORMAS VIGENTES?', answer: '' },
]

const FormSixteen = forwardRef(function FormSixteen(
  { defaultValues }: FormSixteenProps,
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
          localInstallationExaminationsPerformed: {
            ...(defaultValues?.localInstallationExaminationsPerformed ?? {}),
            tests: {
              questions: values.testsLocalInstallation,
              nrsToAdd: values.nrsLocalInstallation,
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
          name="nrsLocalInstallation"
          render={({ field }) => (
            <FormItem className="flex justify-end">
              <FormControl>
                <NrSelect
                  onSelectNr={(nrs) => {
                    field.onChange(nrs)
                  }}
                  nrs={field.value ?? nrsLocalInstallationBoiler}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="testsLocalInstallation"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TableQuestion
                  options={field.value || questionsAboutInstallationLocal}
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

export { FormSixteen }
