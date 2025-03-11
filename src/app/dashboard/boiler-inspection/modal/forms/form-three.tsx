import { zodResolver } from '@hookform/resolvers/zod'
import { Combobox } from '@inspetor/components/combobox'
import { DocumentField } from '@inspetor/components/document-field'
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
import { Textarea } from '@inspetor/components/ui/textarea'
import { getUsersOptions } from '@inspetor/http/firebase/user/combobox/get-users'
import { makeOptionObject } from '@inspetor/utils/combobox-options'
import { forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  responsible: z.string(),
  operatorName: z.string(),
  isAbleToOperateWithNR13: z.string(),
  certificate: z
    .array(
      z.object({
        name: z.string().nonempty("O campo 'name' não pode estar vazio."),
        downloadUrl: z.string().nonempty("O campo 'url' não pode estar vazio."),
        type: z.string().nonempty("O campo 'type' não pode estar vazio."),

        size: z.number(),

        createdAt: z.number().refine((val) => !isNaN(val), {
          message: "O campo 'createdAt' deve ser um número válido.",
        }),
        createdBy: z
          .string()
          .nonempty("O campo 'createdBy' não pode estar vazio."),
        updatedAt: z.number().refine((val) => !isNaN(val), {
          message: "O campo 'updatedAt' deve ser um número válido.",
        }),
        updatedBy: z
          .string()
          .nonempty("O campo 'updatedBy' não pode estar vazio."),

        id: z.string().nonempty("O campo 'id' não pode estar vazio."),
        companyOfUser: z
          .string()
          .nonempty("O campo 'companyOfUser' não pode estar vazio."),
      }),
    )
    .optional(),
  provisionsForOperator: z.string().optional(),
  observations: z.string().optional(),
})

type Schema = z.infer<typeof schema>

type FormThreeProps = {
  defaultValues?: Record<string, any>
}

const FormThree = forwardRef(function FormThree(
  { defaultValues }: FormThreeProps,
  ref,
) {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const responsible = form.watch('responsible') ?? ''
  const isOperatorAbleToOperateWithNR13 = form.watch('isAbleToOperateWithNR13')

  useImperativeHandle(ref, () => {
    return {
      getValues: form.getValues,
      runAutoCompleteAndFormatterWithDefaultValues: (values: Schema) => {
        if (!values.observations) {
          values.observations = ''
        }

        const responsible = makeOptionObject(values.responsible, [
          'id',
          'name',
          'stateRegistry',
        ])

        return {
          ...values,
          responsible,
          operator: {
            name: values.operatorName,
            isAbleToOperateWithNR13: values.isAbleToOperateWithNR13,
            certificate: values.certificate,
            provisionsForOperator: values.provisionsForOperator,
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
          name="responsible"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-50">
                Engenheiro responsável
              </FormLabel>
              <FormControl>
                <Combobox
                  entityKey="user"
                  onChange={field.onChange}
                  value={field.value}
                  queryFn={getUsersOptions}
                  // label="SeleciThree um cliente..."
                  triggerClassName="h-10 !bg-inspetor-gray-300 hover:!bg-inspetor-gray-300"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-0.5">
          <Label variant="form">Registro nacional do engenheiro</Label>
          <Input value={responsible.split('|').at(2) ?? ''} disabled />
        </div>

        <FormField
          name="operatorName"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel className="text-zinc-50">
                  Nome do operador de caldeira
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
          control={form.control}
          name="isAbleToOperateWithNR13"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-50">
                Operador se enquadra na nr13?
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

        {isOperatorAbleToOperateWithNR13 === 'yes' && (
          <FormField
            control={form.control}
            name="certificate"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className="text-zinc-50">
                    Certificado do operador
                  </FormLabel>
                  <FormControl>
                    <DocumentField
                      isOnModal
                      baseFolderToUpload="boiler-inspection-certificate"
                      accept="image/*"
                      placeholder="Selecione um documento"
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
        )}

        {isOperatorAbleToOperateWithNR13 === 'no' && (
          <FormField
            control={form.control}
            name="provisionsForOperator"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className="text-zinc-50">
                    Providências necessárias para o operador
                  </FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue className="truncate" />
                      </SelectTrigger>

                      <SelectContent className="max-w-[462px]">
                        <SelectItem value="Operador sem curso de segurança na operação de caldeira">
                          Operador sem curso de segurança na operação de
                          caldeira
                        </SelectItem>
                        <SelectItem value="Operador não possui grau de escolaridade necessária para função">
                          Operador não possui grau de escolaridade necessária
                          para função
                        </SelectItem>
                        <SelectItem value="extraordinary">
                          Requisitos minímos do curso não atendidos.
                          Providenciar curso para operador
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
        )}

        <FormField
          name="observations"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                {/* <FormLabel className="text-zinc-50"></FormLabel> */}
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />
      </form>
    </Form>
  )
})

export { FormThree }
