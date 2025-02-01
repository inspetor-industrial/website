import { zodResolver } from '@hookform/resolvers/zod'
import { DocumentField } from '@inspetor/components/document-field'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@inspetor/components/ui/form'
import { Textarea } from '@inspetor/components/ui/textarea'
import { documentValidator } from '@inspetor/utils/zod-validations/document-validator'
import { forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  observations: z.string().optional().default(''),
  boilerHouse: documentValidator,
  extraPhotosBoilerHouse: documentValidator.optional().default([]),
})

type Schema = z.infer<typeof schema>

type FormSeventeenProps = {
  defaultValues?: Record<string, any>
}

const FormSeventeen = forwardRef(function FormSeventeen(
  { defaultValues }: FormSeventeenProps,
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
            boilerHouse: values.boilerHouse,
            observations: values.observations,
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
          name="observations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="boilerHouse"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Anexar foto da casa da caldeira</FormLabel>
              <FormControl>
                <DocumentField
                  isOnModal
                  baseFolderToUpload="boiler-inspection-boiler-house-photo"
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

        <FormField
          control={form.control}
          name="extraPhotosBoilerHouse"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Anexar fotos extras</FormLabel>
              <FormControl>
                <DocumentField
                  isOnModal
                  baseFolderToUpload="boiler-inspection-extra-boiler-house-photo"
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

export { FormSeventeen }
