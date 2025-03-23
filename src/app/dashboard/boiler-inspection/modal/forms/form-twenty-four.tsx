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
import { units } from '@inspetor/constants/units'
import { documentValidator } from '@inspetor/utils/zod-validations/document-validator'
import { forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  levelIndicatorMark: z.string().optional().default(''),
  levelIndicatorGlassLength: z.string().optional().default(''),
  levelIndicatorGlassDiameter: z.string().optional().default(''),
  levelIndicatorPhotos: documentValidator,
})

type Schema = z.infer<typeof schema>

type FormTwentyFourProps = {
  defaultValues?: Record<string, any>
}

const FormTwentyFour = forwardRef(function FormTwentyFour(
  { defaultValues }: FormTwentyFourProps,
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
          calibrationOfTheLevelIndicatorAssembly: {
            ...(defaultValues?.calibrationOfTheLevelIndicatorAssembly ?? {}),
            mark: values.levelIndicatorMark,
            glass: {
              length: values.levelIndicatorGlassLength,
              diameter: values.levelIndicatorGlassDiameter,
            },
            photos: values.levelIndicatorPhotos,
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
          name="levelIndicatorMark"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-50">Marca</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="levelIndicatorGlassLength"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-50">
                Comprimento do vidro
              </FormLabel>
              <FormControl>
                <InputWithSuffix {...field} suffix={units.mm} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="levelIndicatorGlassDiameter"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-50">Diâmetro do vidro</FormLabel>
              <FormControl>
                <InputWithSuffix {...field} suffix={units.pol} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="levelIndicatorPhotos"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-50">Fotos:</FormLabel>
              <FormControl>
                <DocumentField
                  isOnModal
                  baseFolderToUpload="boiler-inspection-level-indicator-photo"
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

export { FormTwentyFour }
