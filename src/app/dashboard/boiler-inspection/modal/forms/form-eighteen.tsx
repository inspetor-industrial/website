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
  calibrationOrderNumber: z.string().optional().default(''),
  markPressureGauge: z.string().optional().default(''),
  diameterPressureGauge: z.string().optional().default(''),
  capacityPressureGauge: z.string().optional().default(''),
  photosGauge: documentValidator.optional().default([]),
})

type Schema = z.infer<typeof schema>

type FormEighteenProps = {
  defaultValues?: Record<string, any>
}

const FormEighteen = forwardRef(function FormEighteen(
  { defaultValues }: FormEighteenProps,
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
          pressureGaugeCalibration: {
            ...(defaultValues?.pressureGaugeCalibration ?? {}),
            calibrationOrderNumber: values.calibrationOrderNumber,
            mark: values.markPressureGauge,
            diameter: values.diameterPressureGauge,
            capacity: values.capacityPressureGauge,
            photos: values.photosGauge,
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
          name="calibrationOrderNumber"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel className="text-zinc-50">
                  Número de ordem de calibração
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <FormField
          name="markPressureGauge"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel className="text-zinc-50">Marca</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )
          }}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="diameterPressureGauge"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-50">Diâmetro</FormLabel>
                <FormControl>
                  <InputWithSuffix {...field} suffix={units.pol} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="capacityPressureGauge"
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className="text-zinc-50">Capacidade</FormLabel>
                  <FormControl>
                    <InputWithSuffix {...field} suffix={units.kgfPerCm2} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
        </div>

        <FormField
          control={form.control}
          name="photosGauge"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-50">
                Anexar foto do manômetro
              </FormLabel>
              <FormControl>
                <DocumentField
                  isOnModal
                  baseFolderToUpload="boiler-gauge-pressure-photo"
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

export { FormEighteen }
