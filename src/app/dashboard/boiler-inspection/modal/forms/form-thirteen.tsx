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
  plateIdentification: documentValidator,
  boiler: documentValidator,
  extraPhotos: documentValidator.optional().default([]),
})

type Schema = z.infer<typeof schema>

type FormThirteenProps = {
  defaultValues?: Record<string, any>
}

const FormThirteen = forwardRef(function FormThirteen(
  { defaultValues }: FormThirteenProps,
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
            plateIdentification: values.plateIdentification,
            boiler: values.boiler,
            observations: values.observations,
            extraPhotos: values.extraPhotos,
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
          name="plateIdentification"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Anexar foto da placa de identificação</FormLabel>
              <FormControl>
                <DocumentField
                  isOnModal
                  baseFolderToUpload="boiler-inspection-plate-identification-photo"
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
          name="boiler"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Anexar foto da caldeira</FormLabel>
              <FormControl>
                <DocumentField
                  isOnModal
                  baseFolderToUpload="boiler-inspection-boiler-photo"
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
          name="extraPhotos"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Anexar fotos extras</FormLabel>
              <FormControl>
                <DocumentField
                  isOnModal
                  baseFolderToUpload="boiler-inspection-extern-exam-extra-photo"
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

export { FormThirteen }
