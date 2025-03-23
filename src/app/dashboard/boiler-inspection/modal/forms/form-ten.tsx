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

import { tableExamsOptions } from '../../exams/examinations-performed'

const schema = z.object({
  tests: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
      }),
    )
    .optional()
    .default([]),
  nrs: nrValidator,
})

type Schema = z.infer<typeof schema>

type FormTenProps = {
  defaultValues?: Record<string, any>
}

const FormTen = forwardRef(function FormTen(
  { defaultValues }: FormTenProps,
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
        return {
          ...values,
          examinationsPerformed: {
            ...(defaultValues?.examinationsPerformed ?? {}),
            tests: {
              questions: values.tests,
              nrsToAdd: values.nrs,
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

export { FormTen }
