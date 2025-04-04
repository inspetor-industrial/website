import { zodResolver } from '@hookform/resolvers/zod'
import { hydrostaticTestQuestions } from '@inspetor/app/dashboard/boiler-inspection/exams/hydrostatic-test-examinations'
import { InputWithSuffix } from '@inspetor/components/input-with-suffix'
import { NrSelect } from '@inspetor/components/nr-select'
import { TableQuestion } from '@inspetor/components/table-question'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@inspetor/components/ui/form'
import { Textarea } from '@inspetor/components/ui/textarea'
import { nrsForHydrostaticTests } from '@inspetor/constants/nrs'
import { units } from '@inspetor/constants/units'
import { nrValidator } from '@inspetor/utils/zod-validations/nr-validator'
import { forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  hydrostaticTests: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
      }),
    )
    .optional()
    .default([]),
  hydrostaticNrs: nrValidator,
  observationsHydrostatic: z.string().optional().default(''),
  duration: z.string().optional().default(''),
  pressure: z.string().optional().default(''),
  procedure: z.string().optional().default(''),
})

type Schema = z.infer<typeof schema>

type FormThirtyProps = {
  defaultValues?: Record<string, any>
}

const FormThirty = forwardRef(function FormThirty(
  { defaultValues }: FormThirtyProps,
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
          hydrostaticTest: {
            ...(defaultValues?.hydrostaticTest ?? {}),
            tests: {
              questions: values.hydrostaticTests,
              nrsToAdd: values.hydrostaticNrs,
            },
            pressure: values.pressure,
            duration: values.duration,
            procedure: values.procedure,
            observations: values.observationsHydrostatic,
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
          name="hydrostaticNrs"
          render={({ field }) => (
            <FormItem className="flex justify-end">
              <FormControl>
                <NrSelect
                  onSelectNr={(nrs) => {
                    field.onChange(nrs)
                  }}
                  nrs={field.value ?? nrsForHydrostaticTests}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hydrostaticTests"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TableQuestion
                  options={field.value || hydrostaticTestQuestions}
                  onChange={field.onChange}
                  // extraLogicOnChange={handleTableExamsApplyNrsLogic}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pressure"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel className="text-zinc-50">
                Pressão de prova aplicada:
              </FormLabel>
              <FormControl>
                <InputWithSuffix {...field} suffix={units.kgfPerCm2} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-50">Tempo:</FormLabel>
              <FormControl>
                <InputWithSuffix {...field} suffix={units.min} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="procedure"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel className="text-zinc-50">Procedimento:</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="w-full h-20 p-2 border border-gray-300 rounded-md"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="observationsHydrostatic"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel className="text-zinc-50">Observações:</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="w-full h-20 p-2 border border-gray-300 rounded-md"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
})

export { FormThirty }
