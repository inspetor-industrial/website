import { zodResolver } from '@hookform/resolvers/zod'
import { NrSelect } from '@inspetor/components/nr-select'
import { TableQuestion } from '@inspetor/components/table-question'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '@inspetor/components/ui/form'
import { examsNrs } from '@inspetor/constants/nrs'
import { nrValidator } from '@inspetor/utils/zod-validations/nr-validator'
import { forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  tests: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    }),
  ),
  nrs: nrValidator,
})

type Schema = z.infer<typeof schema>

type FormElevenProps = {
  defaultValues?: Record<string, any>
}

export const tableExamsOptions = [
  { question: 'O PRONTUÁRIO FOI ENCONTRADO COMPLETO E EM DIA?', answer: '' },
  {
    question: 'O PRONTUÁRIO ENCONTRA-SE DE ACORDO COM ITEM 13.4.1.5A DA NR13?',
    answer: '',
  },
  { question: 'O PRONTUÁRIO PRECISA SER RESTITUÍDO?', answer: '' },
  { question: 'O PRONTUÁRIO PRECISA SER ADEQUADO?', answer: '' },
  { question: 'A CALDEIRA É MODIFICADO / REFORMADA?', answer: '' },
  { question: 'HÁ PROJETO DE ALTERAÇÃO E REPARO?', answer: '' },
  {
    question: 'HOUVE ACESSO AO LIVRO DE REGISTRO DE SEGURANÇA?',
    answer: '',
  },
  { question: 'O LIVRO DE REGISTRO DE SEGURANÇA É VIRTUAL?', answer: '' },
  {
    question: 'O REGISTRO DE SEGURANÇA ENCONTRA-SE ATUALIZADO?',
    answer: '',
  },
  {
    question:
      'HÁ REGISTRO DE INSPEÇÕES PERIÓDICAS REGULARES NO LIVRO DE INSPEÇÃO?',
    answer: '',
  },
  {
    question: 'HÁ CERTIFICADOS DE CALIBRAÇÃO DOS DISPOSITIVOS DE SEGURANÇA?',
    answer: '',
  },
  {
    question: 'OS CERTIFICADOS POSSUEM DISPOSITIVOS DE CALIBRAÇÃO VÁLIDOS?',
    answer: '',
  },
  {
    question: 'OS DISPOSITIVOS ESTÃO DENTRO DO PRAZO DE VALIDADE?',
    answer: '',
  },
  {
    question: 'A PRESENTE INSPEÇÃO FOI REALIZADA NO PRAZO PARA ISSO FIXADA?',
    answer: '',
  },
  {
    question: 'AS RECOMENDAÇÕES ANTERIORES FORAM POSTAS EM PRÁTICA?',
    answer: '',
  },
]

const FormEleven = forwardRef(function FormEleven(
  { defaultValues }: FormElevenProps,
  ref,
) {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  function handleTableExamsApplyNrsLogic(
    options: Schema['tests'],
    currentOption: Schema['tests'][0],
  ) {
    let auxOptions = options
    const reformedOption = 'A CALDEIRA É MODIFICADO / REFORMADA?'
    const changesProjectOption = 'HÁ PROJETO DE ALTERAÇÃO E REPARO?'

    console.log('reformedOption', currentOption)
    if (currentOption.question === reformedOption) {
      if (currentOption.answer === 'no') {
        auxOptions = options.filter((o) => o.question !== changesProjectOption)
      } else if (
        currentOption.answer === 'yes' &&
        !options.some((o) => o.question === changesProjectOption)
      ) {
        auxOptions = options
          .slice(0, 5)
          .concat({
            question: changesProjectOption,
            answer: '',
          })
          .concat(options.slice(5))
      }
    }

    return auxOptions
  }

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
      <form className="space-y-2.5 max-w-[462px]">
        <FormField
          control={form.control}
          name="nrs"
          render={({ field }) => (
            <FormItem className="flex justify-end">
              <FormControl>
                <NrSelect
                  onSelectNr={(nrs) => {
                    field.onChange(nrs)
                  }}
                  nrs={field.value ?? examsNrs}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tests"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TableQuestion
                  options={field.value || tableExamsOptions}
                  onChange={field.onChange}
                  extraLogicOnChange={handleTableExamsApplyNrsLogic}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
})

export { FormEleven }
