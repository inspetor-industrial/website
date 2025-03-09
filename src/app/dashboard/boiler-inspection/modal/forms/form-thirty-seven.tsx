import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@inspetor/components/ui/form'
import { Input } from '@inspetor/components/ui/input'
import { Switch } from '@inspetor/components/ui/switch'
import { forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  deadlineForNextInspection: z.string().optional().default(''),
  nrItemsThatNotBeingMet: z.string().optional().default(''),
  immediateMeasuresNecessary: z.string().optional().default(''),
  necessaryRecommendations: z.string().optional().default(''),
  canBeOperateNormally: z.boolean().optional().default(false),
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
              <FormLabel>PRAZO PARA EXECUÇÃO:</FormLabel>
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
              <FormLabel>
                ITENS DESTA NR QUE NÃO ESTÃO SENDO ATENDIDOS:
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
          name="immediateMeasuresNecessary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PROVIDÊNCIAS IMEDIATAS NECESSÁRIAS:</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>RECOMENDAÇÕES NECESSÁRIAS:</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>
                A CALDEIRA INSPECIONADA PODE SER UTILIZADA NORMALMENTE?
              </FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
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

export { FormThirtySeven }
