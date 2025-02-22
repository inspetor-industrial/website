import { zodResolver } from '@hookform/resolvers/zod'
import { DocumentField } from '@inspetor/components/document-field'
import { InputWithSuffix } from '@inspetor/components/input-with-suffix'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@inspetor/components/ui/form'
import { Input } from '@inspetor/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@inspetor/components/ui/select'
import { units } from '@inspetor/constants/units'
import { documentValidator } from '@inspetor/utils/zod-validations/document-validator'
import { forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  serialNumber: z.string().optional().default(''),
  markInjector: z.string().optional().default(''),
  diameterInjector: z.string().optional().default(''),
  fuelInjector: z.string().optional().default(''),
  injectorPhotos: documentValidator.optional().default([]),
})

type Schema = z.infer<typeof schema>

type FormTwentyProps = {
  defaultValues?: Record<string, any>
}

const FormTwenty = forwardRef(function FormTwenty(
  { defaultValues }: FormTwentyProps,
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
          injectorGauge: {
            ...(defaultValues?.injectorGauge ?? {}),
            serialNumber: values.serialNumber,
            mark: values.markInjector,
            diameter: values.diameterInjector,
            fuel: values.fuelInjector,
            photos: values.injectorPhotos,
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
          name="serialNumber"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Número de série do injetor</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <FormField
          name="markInjector"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Marca</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )
          }}
        />

        <FormField
          control={form.control}
          name="diameterInjector"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diâmetro</FormLabel>
              <FormControl>
                <InputWithSuffix {...field} suffix={units.pol} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="fuelInjector"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Tipo do combustível</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="liquid">Líquido</SelectItem>
                      <SelectItem value="gaseous">Gasoso</SelectItem>
                      <SelectItem value="solid">Sólido</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />

        <FormField
          control={form.control}
          name="injectorPhotos"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Anexar foto do injetor</FormLabel>
              <FormControl>
                <DocumentField
                  isOnModal
                  baseFolderToUpload="boiler-injector-photo"
                  accept="image/*"
                  placeholder="Selecione um documento"
                  onChange={field.onChange}
                  value={field.value}
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

export { FormTwenty }
