import { zodResolver } from '@hookform/resolvers/zod'
import { NrSelect } from '@inspetor/components/nr-select'
import { TableQuestion } from '@inspetor/components/table-question'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '@inspetor/components/ui/form'
import { externalExamsNrs } from '@inspetor/constants/nrs'
import { nrValidator } from '@inspetor/utils/zod-validations/nr-validator'
import { forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const tableExternExamsQuestions = [
  {
    question:
      'HÁ PLACA DE IDENTIFICAÇÃO DA CALDEIRA EM LOCAL DE FÁCIL ACESSO E COM ANOTAÇÃO VISÍVEL?',
    answer: '',
  },
  {
    question: 'A PLACA POSSUI OS REQUISITOS MÍNIMOS PREVISTOS NA NR 13.4.1.3?',
    answer: '',
  },
  {
    question: 'HÁ INDICADOR DA CATEGORIA DA CALDEIRA AFIXADO EM LOCAL VISÍVEL?',
    answer: '',
  },
  { question: 'A CALDEIRA FUNCIONA NORMALMENTE?', answer: '' },
  {
    question:
      'A CALDEIRA SATISFAZ AS CONDIÇÕES DE SEGURANÇA CONSTANTES NA NR13 E OBSERVÁVEIS NESTE EXAME?',
    answer: '',
  },
  {
    question: 'FOI OBSERVADO ALGUMA ANOMALIA CAPAZ DE PREJUDICAR A SEGURANÇA?',
    answer: '',
  },
  { question: 'HÁ ALGUM VAZAMENTO?', answer: '' },
  { question: 'O ENCAPAMENTO SE ENCONTRA EM PERFEITO ESTADO?', answer: '' },
  {
    question: 'HÁ RISCOS DE QUEIMADURA POR FALTA DE ENCAPAMENTO?',
    answer: '',
  },
  { question: 'HÁ SINAIS DE DETERIORAÇÃO APARENTE?', answer: '' },
  {
    question:
      'A DETERIORAÇÃO INTERFERE DE FORMA IMEDIATA NO FUNCIONAMENTO DA MESMA?',
    answer: '',
  },
  {
    question: 'AS VÁLVULAS, REGISTROS E TUBULAÇÃO ENCONTRAM-SE EM BOM ESTADO?',
    answer: '',
  },
  {
    question: 'A CHAMINÉ DE CALDEIRA ENCONTRA-SE EM BOM ESTADO?',
    answer: '',
  },
  {
    question: 'AS PASSAGENS DIANTEIRAS E TRANSEIRAS, ESTÃO EM BOM ESTADO?',
    answer: '',
  },
  { question: 'A BASE DE CALDEIRA ENCONTRA-SE EM BOM ESTADO?', answer: '' },
  { question: 'HÁ NECESSIDADE DE PINTURA DA CALDEIRA?', answer: '' },
]

const schema = z.object({
  externExamTests: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    }),
  ),
  externExamNrs: nrValidator,
})

type Schema = z.infer<typeof schema>

type FormTwelveProps = {
  defaultValues?: Record<string, any>
}

const FormTwelve = forwardRef(function FormTwelve(
  { defaultValues }: FormTwelveProps,
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
          externalExaminationsPerformed: {
            ...(defaultValues?.externalExaminationsPerformed ?? {}),
            tests: {
              questions: values.externExamTests,
              nrsToAdd: values.externExamNrs,
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
          name="externExamNrs"
          render={({ field }) => (
            <FormItem className="flex justify-end">
              <FormControl>
                <NrSelect
                  onSelectNr={(nrs) => {
                    field.onChange(nrs)
                  }}
                  nrs={field.value ?? externalExamsNrs}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="externExamTests"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TableQuestion
                  options={field.value || tableExternExamsQuestions}
                  onChange={field.onChange}
                  // extraLogicOnChange={handleTableExamsApplyNrsLogic}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
})

export { FormTwelve }
