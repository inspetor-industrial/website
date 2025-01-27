import { zodResolver } from '@hookform/resolvers/zod'
import { InputWithSuffix } from '@inspetor/components/input-with-suffix'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@inspetor/components/ui/form'
import { units } from '@inspetor/constants/units'
import { forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  mirrorDiameter: z.string().optional(),
  mirrorThickness: z.string().optional(),
  freeLengthWithoutStaysOrTube: z.string().optional(),

  bodyDiameter: z.string().optional(),
  bodyThickness: z.string().optional(),
  bodyLength: z.string().optional(),
})

type Schema = z.infer<typeof schema>

type FormSevenProps = {
  defaultValues?: Record<string, any>
}

const FormSeven = forwardRef(function FormSeven(
  { defaultValues }: FormSevenProps,
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
          structure: {
            ...(defaultValues?.structure ?? {}),
            mirror: {
              diameter: values.mirrorDiameter,
              thickness: values.mirrorThickness,
            },

            freeLengthWithoutStaysOrTube: values.freeLengthWithoutStaysOrTube,

            body: {
              ...(defaultValues?.structure?.body ?? {}),

              diameter: values.bodyDiameter,
              thickness: values.bodyThickness,
              length: values.bodyLength,
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
          name="mirrorDiameter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diâmetro do espelho</FormLabel>
              <FormControl>
                <InputWithSuffix {...field} suffix={units.mm} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mirrorThickness"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Espessura do espelho</FormLabel>
              <FormControl>
                <InputWithSuffix {...field} suffix={units.pol} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="freeLengthWithoutStaysOrTube"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diâmetro do espelho</FormLabel>
              <FormControl>
                <InputWithSuffix {...field} suffix={units.mm} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bodyLength"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comprimento do corpo</FormLabel>
              <FormControl>
                <InputWithSuffix {...field} suffix={units.mm} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bodyDiameter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diâmetro do corpo</FormLabel>
              <FormControl>
                <InputWithSuffix {...field} suffix={units.mm} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bodyThickness"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Espessura do corpo</FormLabel>
              <FormControl>
                <InputWithSuffix {...field} suffix={units.mm} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
})

export { FormSeven }
