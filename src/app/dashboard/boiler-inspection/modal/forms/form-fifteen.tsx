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
  observationsInternalExams: z.string().optional().default(''),
  tubes: documentValidator,
  furnaceInternalExaminations: documentValidator,
  internalBoiler: documentValidator.optional().default([]),
  extraInternalBoilerPhotos: documentValidator.optional().default([]),
})

type Schema = z.infer<typeof schema>

type FormFifteenProps = {
  defaultValues?: Record<string, any>
}

const FormFifteen = forwardRef(function FormFifteen(
  { defaultValues }: FormFifteenProps,
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
          internalExaminationsPerformed: {
            ...(defaultValues?.internalExaminationsPerformed ?? {}),
            tubes: values.tubes,
            furnaceInternalExaminations: values.furnaceInternalExaminations,
            internalBoiler: values.internalBoiler,
            extraPhotos: values.extraInternalBoilerPhotos,
            observations: values.observationsInternalExams,
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
          name="observationsInternalExams"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-50">Observações</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tubes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-50">
                Anexar foto do tubo
              </FormLabel>
              <FormControl>
                <DocumentField
                  isOnModal
                  baseFolderToUpload="boiler-inspection-tube-photo"
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
          name="furnaceInternalExaminations"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-50">
                Anexar foto da fornalha
              </FormLabel>
              <FormControl>
                <DocumentField
                  isOnModal
                  baseFolderToUpload="boiler-inspection-furnace-photo"
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
          name="internalBoiler"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-50">
                Anexar foto do exame interno da caldeira
              </FormLabel>
              <FormControl>
                <DocumentField
                  isOnModal
                  baseFolderToUpload="boiler-inspection-internal-boiler-photo"
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
          name="extraInternalBoilerPhotos"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-50">
                Anexar fotos extras
              </FormLabel>
              <FormControl>
                <DocumentField
                  isOnModal
                  baseFolderToUpload="boiler-inspection-intern-exam-extra-photo-photo"
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

export { FormFifteen }
