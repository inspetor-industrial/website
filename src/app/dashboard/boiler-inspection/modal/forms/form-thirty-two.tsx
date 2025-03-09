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
import { Separator } from '@inspetor/components/ui/separator'
import { Switch } from '@inspetor/components/ui/switch'
import { units } from '@inspetor/constants/units'
import { documentValidator } from '@inspetor/utils/zod-validations/document-validator'
import { forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  isRegularizedAccordingToASME1: z.boolean().optional().default(false),
  totalBodyExaminationA: z.string().optional().default(''),
  meanBodyExaminationA: z.string().optional().default(''),
  thicknessProvidedByManufacturerBodyExaminationA: z
    .string()
    .optional()
    .default(''),
  corrosionRateBodyExaminationA: z.string().optional().default(''),
  allowableThicknessBodyExaminationA: z.string().optional().default(''),
  photosBodyExaminationA: documentValidator,
})

type Schema = z.infer<typeof schema>

type FormThirtyTwoProps = {
  defaultValues?: Record<string, any>
}

const FormThirtyTwo = forwardRef(function FormThirtyTwo(
  { defaultValues }: FormThirtyTwoProps,
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
          ultrasoundTests: {
            ...(defaultValues?.ultrasoundTests ?? {}),
            bodyExaminationA: {
              ...(defaultValues?.ultrasoundTests?.bodyExaminationA ?? {}),
              isRegularizedAccordingToASME1:
                values.isRegularizedAccordingToASME1,
              total: values.totalBodyExaminationA,
              mean: values.meanBodyExaminationA,
              thicknessProvidedByManufacturer:
                values.thicknessProvidedByManufacturerBodyExaminationA,
              corrosionRate: values.corrosionRateBodyExaminationA,
              allowableThickness: values.allowableThicknessBodyExaminationA,
              photos: values.photosBodyExaminationA,
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
          name="isRegularizedAccordingToASME1"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Regularizado conforme ASME I?</FormLabel>
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

        <FormField
          control={form.control}
          name="totalBodyExaminationA"
          render={({ field }) => (
            <FormItem>
              <FormLabel>TOTAL DE MEDIDAS TOMADAS:</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="meanBodyExaminationA"
          render={({ field }) => (
            <FormItem>
              <FormLabel>MÉDIA DETERMINADA:</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="thicknessProvidedByManufacturerBodyExaminationA"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ESPESSURA FORNECIDA PELO FABRICANTE:</FormLabel>
              <FormControl>
                <InputWithSuffix {...field} suffix={units.mm} type="number" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="corrosionRateBodyExaminationA"
          render={({ field }) => (
            <FormItem>
              <FormLabel>TAXA DE CORROSÃO:</FormLabel>
              <FormControl>
                <InputWithSuffix
                  {...field}
                  suffix={units.percentage}
                  type="number"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="allowableThicknessBodyExaminationA"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ESP. MÍN. ADMITIDA PARA A PRESSÃO DE SERV.:</FormLabel>
              <FormControl>
                <InputWithSuffix {...field} suffix={units.mm} type="number" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="photosBodyExaminationA"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fotos</FormLabel>
              <FormControl>
                <DocumentField
                  isOnModal
                  baseFolderToUpload="boiler-inspection-ultrasonic-a-photo"
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

export { FormThirtyTwo }
