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
import { Input } from '@inspetor/components/ui/input'
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
  tubeThickness: z.string().optional(),
  tubeMaterial: z.string().optional(),
  tubeHasCertificateOfManufacturer: z.string().optional(),
  tubeIsNaturalOrForced: z.string().optional(),
  quantityOfSafetyFuse: z.string().optional(),
})

type Schema = z.infer<typeof schema>

type FormNineProps = {
  defaultValues?: Record<string, any>
}

export const tubeMaterialOptions = [
  { value: 'ASTM A 178', label: 'ASTM A 178' },
  { value: 'NÃO ESPECIFICADO', label: 'NÃO ESPECIFICADO' },
]

const FormNine = forwardRef(function FormNine(
  { defaultValues }: FormNineProps,
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

              material: values.tubeMaterial,
              thickness: values.tubeThickness,
              hasCertificateOfManufacturer:
                values.tubeHasCertificateOfManufacturer,
              isNaturalOrForced: values.tubeIsNaturalOrForced,
            },

            quantityOfSafetyFuse: values.quantityOfSafetyFuse,
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
          name="tubeThickness"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-50">Espessura de tubos</FormLabel>
              <FormControl>
                <InputWithSuffix {...field} suffix={units.mm} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tubeMaterial"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-50">Material do tubo</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue className="truncate" />
                  </SelectTrigger>

                  <SelectContent className="max-w-[462px]">
                    {tubeMaterialOptions.map((option) => (
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
          name="tubeHasCertificateOfManufacturer"
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
          name="tubeIsNaturalOrForced"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-50">Tipo de tiragem</FormLabel>
              <FormControl>
                <div className="flex space-x-2">
                  <div className="space-x-1 flex items-center">
                    <Checkbox
                      checked={field.value === 'natural'}
                      onCheckedChange={(checked) => {
                        field.onChange(checked ? 'natural' : '')
                      }}
                      className="border-zinc-950 bg-zinc-800 data-[state=checked]:bg-blue-800"
                      id="option-natural"
                    />
                    <Label
                      htmlFor="option-natural"
                      variant="form"
                      className="text-sm"
                    >
                      Natural
                    </Label>
                  </div>
                  <div className="space-x-1 flex items-center">
                    <Checkbox
                      checked={field.value === 'forced'}
                      onCheckedChange={(checked) => {
                        field.onChange(checked ? 'forced' : '')
                      }}
                      className="border-zinc-950 bg-zinc-800 data-[state=checked]:bg-blue-800"
                      id="option-forced"
                    />
                    <Label
                      htmlFor="option-forced"
                      variant="form"
                      className="text-sm"
                    >
                      Forçada
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
          name="quantityOfSafetyFuse"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-50">
                Número de fusíveis de segurança
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
})

export { FormNine }
