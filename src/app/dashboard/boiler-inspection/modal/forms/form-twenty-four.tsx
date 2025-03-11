import { zodResolver } from '@hookform/resolvers/zod'
import { DocumentField } from '@inspetor/components/document-field'
import { InputWithSuffix } from '@inspetor/components/input-with-suffix'
import { NrSelect } from '@inspetor/components/nr-select'
import { TableQuestion } from '@inspetor/components/table-question'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@inspetor/components/ui/form'
import { Input } from '@inspetor/components/ui/input'
import { Textarea } from '@inspetor/components/ui/textarea'
import { nrsForBombsSupply } from '@inspetor/constants/nrs'
import { units } from '@inspetor/constants/units'
import { documentValidator } from '@inspetor/utils/zod-validations/document-validator'
import { nrValidator } from '@inspetor/utils/zod-validations/nr-validator'
import { forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const tableBombsQuestions = [
  {
    question: 'FOI REALIZADO?',
    answer: '',
  },
  {
    question: 'A BOMBA ENCONTRA-SE FUNCIONANDO NORMALMENTE?',
    answer: '',
  },
  {
    question: 'É SUFICIENTE PARA SUPORTAR A PRESSÃO DE USO DO EQUIPAMENTO?',
    answer: '',
  },
  {
    question: 'FOI OBSERVADA ALGUMA ANOMALIA CAPAZ DE PREJUDICAR A SEGURANÇA?',
    answer: '',
  },
  {
    question: 'HOUVE ALGUM OUTRO PROBLEMA RELACIONADO Á PRESSÃO APLICADA?',
    answer: '',
  },
]

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
