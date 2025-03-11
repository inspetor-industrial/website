import { zodResolver } from '@hookform/resolvers/zod'
import { Checkbox } from '@inspetor/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@inspetor/components/ui/form'
import { Input } from '@inspetor/components/ui/input'
import { Label } from '@inspetor/components/ui/label'
import { Textarea } from '@inspetor/components/ui/textarea'
import { forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  deadlineForNextInspection: z.string().optional().default(''),
  nrItemsThatNotBeingMet: z.string().optional().default(''),
  immediateMeasuresNecessary: z.string().optional().default(''),
  necessaryRecommendations: z.string().optional().default(''),
  canBeOperateNormally: z.string().optional().default(''),
})

type Schema = z.infer<typeof schema>

type FormThirtySevenProps = {
  defaultValues?: Record<string, any>
}

const FormThirtySeven = forwardRef(function FormThirtySeven(
  { defaultValues }: FormThirtySevenProps,
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
          conclusions: {
            ...(defaultValues?.conclusions || {}),
            deadlineForNextInspection: values.deadlineForNextInspection,
            nrItemsThatNotBeingMet: values.nrItemsThatNotBeingMet,
            immediateMeasuresNecessary: values.immediateMeasuresNecessary,
            necessaryRecommendations: values.necessaryRecommendations,
            canBeOperateNormally: values.canBeOperateNormally,
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
          name="deadlineForNextInspection"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-50">
                PRAZO PARA EXECUÇÃO:
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nrItemsThatNotBeingMet"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-50">
                ITENS DESTA NR QUE NÃO ESTÃO SENDO ATENDIDOS:
              </FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="immediateMeasuresNecessary"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-50">
                PROVIDÊNCIAS IMEDIATAS NECESSÁRIAS:
              </FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="necessaryRecommendations"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-50">
                RECOMENDAÇÕES NECESSÁRIAS:
              </FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="canBeOperateNormally"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-zinc-50">
                A CALDEIRA INSPECIONADA PODE SER UTILIZADA NORMALMENTE?
              </FormLabel>
              <FormControl>
                <div className="flex space-x-2">
                  <div className="space-x-1 flex items-center">
                    <Checkbox
                      checked={field.value === 'yes'}
                      onCheckedChange={(checked) => {
                        field.onChange(checked ? 'yes' : '')
                      }}
                      className="border-zinc-950 bg-zinc-800 data-[state=checked]:bg-blue-800"
                      id="option-yes"
                    />
                    <Label
                      htmlFor="option-yes"
                      variant="form"
                      className="text-sm"
                    >
                      SIM
                    </Label>
                  </div>
                  <div className="space-x-1 flex items-center">
                    <Checkbox
                      checked={field.value === 'no'}
                      onCheckedChange={(checked) => {
                        field.onChange(checked ? 'no' : '')
                      }}
                      className="border-zinc-950 bg-zinc-800 data-[state=checked]:bg-blue-800"
                      id="option-no"
                    />
                    <Label
                      htmlFor="option-no"
                      variant="form"
                      className="text-sm"
                    >
                      NÃO
                    </Label>
                  </div>
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
})

export { FormThirtySeven }
