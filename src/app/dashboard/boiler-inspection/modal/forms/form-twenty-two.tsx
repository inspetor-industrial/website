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
import { units } from '@inspetor/constants/units'
import { documentValidator } from '@inspetor/utils/zod-validations/document-validator'
import { forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  quantityOfBombs: z.string(),
  bomb1: z.object({
    mark: z.string().optional().default(''),
    stages: z.string().optional().default(''),
    model: z.string().optional().default(''),
    potency: z.string().optional().default(''),

    photos: documentValidator,
  }),
  bomb2: z.object({
    mark: z.string().optional().default(''),
    stages: z.string().optional().default(''),
    model: z.string().optional().default(''),
    potency: z.string().optional().default(''),

    photos: documentValidator,
  }),
})

type Schema = z.infer<typeof schema>

type FormTwentyTwoProps = {
  defaultValues?: Record<string, any>
}

const FormTwentyTwo = forwardRef(function FormTwentyTwo(
  { defaultValues }: FormTwentyTwoProps,
  ref,
) {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const quantityOfBombs = Number(form.watch('quantityOfBombs') ?? '0')

  useImperativeHandle(ref, () => {
    return {
      getValues: form.getValues,
      runAutoCompleteAndFormatterWithDefaultValues: (values: Schema) => {
        return {
          ...values,
          powerSupply: {
            ...(defaultValues?.powerSupply ?? {}),
            bombs: [values.bomb1, values.bomb2],
            quantityOfBombs: values.quantityOfBombs,
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
          name="quantityOfBombs"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Selecione a quantidade de bombas:</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(quantity) => {
                    field.onChange(quantity)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Uma Bomba</SelectItem>
                    <SelectItem value="2">Duas Bombas</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        {quantityOfBombs >= 1 && (
          <div className="space-y-2.5">
            <span className="text-white text-lg mt-2">Bomba 1</span>

            <FormField
              control={form.control}
              name="bomb1.mark"
              render={({ field }) => (
                <FormItem className="mt-0">
                  <FormLabel>Marca:</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bomb1.stages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estágios:</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bomb1.photos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fotos:</FormLabel>
                  <FormControl>
                    <DocumentField
                      isOnModal
                      baseFolderToUpload="boiler-inspection-bomb-1-photo"
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

            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="bomb1.model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo:</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bomb1.potency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Potência:</FormLabel>
                    <FormControl>
                      <InputWithSuffix {...field} suffix={units.cv} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        <Separator />

        {quantityOfBombs === 2 && (
          <div className="space-y-2.5">
            <span className="text-white text-lg mt-2">Bomba 2</span>

            <FormField
              control={form.control}
              name="bomb1.mark"
              render={({ field }) => (
                <FormItem className="mt-0">
                  <FormLabel>Marca:</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bomb1.stages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estágios:</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bomb1.photos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fotos:</FormLabel>
                  <FormControl>
                    <DocumentField
                      isOnModal
                      baseFolderToUpload="boiler-inspection-bomb-1-photo"
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

            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="bomb1.model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo:</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bomb1.potency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Potência:</FormLabel>
                    <FormControl>
                      <InputWithSuffix {...field} suffix={units.cv} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}
      </form>
    </Form>
  )
})

export { FormTwentyTwo }
