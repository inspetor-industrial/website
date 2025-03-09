import { z } from 'zod'

export const documentValidator = z.array(
  z.object({
    name: z.string().nonempty("O campo 'name' não pode estar vazio."),
    downloadUrl: z.string().nonempty("O campo 'url' não pode estar vazio."),
    type: z.string().nonempty("O campo 'type' não pode estar vazio."),

    size: z.number(),

    createdAt: z.number().refine((val) => !isNaN(val), {
      message: "O campo 'createdAt' deve ser um número válido.",
    }),
    createdBy: z.string().nonempty("O campo 'createdBy' não pode estar vazio."),
    updatedAt: z.number().refine((val) => !isNaN(val), {
      message: "O campo 'updatedAt' deve ser um número válido.",
    }),
    updatedBy: z.string().nonempty("O campo 'updatedBy' não pode estar vazio."),

    id: z.string().nonempty("O campo 'id' não pode estar vazio."),
    companyOfUser: z
      .string()
      .nonempty("O campo 'companyOfUser' não pode estar vazio."),
  }),
)
