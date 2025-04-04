import { zodResolver } from '@hookform/resolvers/zod'
import { accumulationTestQuestions } from '@inspetor/app/dashboard/boiler-inspection/exams/accumulation-test-examinations'
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
import { nrsForAccumulationTests } from '@inspetor/constants/nrs'
import { units } from '@inspetor/constants/units'
import { nrValidator } from '@inspetor/utils/zod-validations/nr-validator'
import { forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  accumulationTests: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
      }),
    )
    .optional()
    .default([]),
  accumulationNrs: nrValidator,
  observationsAccumulation: z.string().optional().default(''),
  duration: z.string().optional().default(''),
  pressure: z.string().optional().default(''),
})

type Schema = z.infer<typeof schema>

type FormThirtyOneProps = {
  defaultValues?: Record<string, any>
}

const FormThirtyOne = forwardRef(function FormThirtyOne(
  { defaultValues }: FormThirtyOneProps,
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
          accumulationTest: {
            ...(defaultValues?.accumulationTest ?? {}),
            tests: {
              questions: values.accumulationTests,
              nrsToAdd: values.accumulationNrs,
            },
            pressure: values.pressure,
            duration: values.duration,
            observations: values.observationsAccumulation,
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
          name="accumulationNrs"
          render={({ field }) => (
            <FormItem className="flex justify-end">
              <FormControl>
                <NrSelect
                  onSelectNr={(nrs) => {
                    field.onChange(nrs)
                  }}
                  nrs={field.value ?? nrsForAccumulationTests}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accumulationTests"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TableQuestion
                  options={field.value || accumulationTestQuestions}
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
          name="observationsAccumulation"
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

export { FormThirtyOne }
