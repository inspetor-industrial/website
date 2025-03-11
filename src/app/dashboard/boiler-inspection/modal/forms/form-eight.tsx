import { zodResolver } from '@hookform/resolvers/zod'
import { InputWithSuffix } from '@inspetor/components/input-with-suffix'
import { Checkbox } from '@inspetor/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@inspetor/components/ui/form'
import { Label } from '@inspetor/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@inspetor/components/ui/select'
import { units } from '@inspetor/constants/units'
import { forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  bodyMaterial: z.string().optional(),
  bodyHasCertificateOfManufacturer: z.string().optional(),
  tubeQuantity: z.string().optional(),
  tubeDiameter: z.string().optional(),
  tubeLength: z.string().optional(),
})

type Schema = z.infer<typeof schema>

type FormEightProps = {
  defaultValues?: Record<string, any>
}

export const bodyMaterialOptions = [
  { value: 'ASTM A 285 GRC', label: 'ASTM A 285 GRC' },
  { value: 'ASTM A 516', label: 'ASTM A 516' },
  { value: 'NÃO ESPECIFICADO', label: 'NÃO ESPECIFICADO' },
]

const FormEight = forwardRef(function FormEight(
  { defaultValues }: FormEightProps,
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
            tube: {
              ...(defaultValues?.structure?.tube ?? {}),

              quantity: values.tubeQuantity,
              diameter: values.tubeDiameter,
              length: values.tubeLength,
            },

            body: {
              ...(defaultValues?.structure?.body ?? {}),

              material: values.bodyMaterial,
              hasCertificateOfManufacturer:
                values.bodyHasCertificateOfManufacturer,
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
          name="bodyMaterial"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-50">Material do corpo</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue className="truncate" />
                  </SelectTrigger>

                  <SelectContent className="max-w-[462px]">
                    {bodyMaterialOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bodyHasCertificateOfManufacturer"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-50">
                Certificado do fabricante
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

        <FormField
          control={form.control}
          name="tubeQuantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-50">
                Quantidade de tubos
              </FormLabel>
              <FormControl>
                <InputWithSuffix {...field} suffix={units.un} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tubeLength"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-50">
                Comprimento do tubo
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
          name="tubeDiameter"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-50">Diâmetro do tubo</FormLabel>
              <FormControl>
                <InputWithSuffix {...field} suffix={units.pol} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
})

export { FormEight }
