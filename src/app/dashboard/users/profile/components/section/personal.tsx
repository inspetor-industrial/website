'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { isLoadingProfileAtom, profileAtom } from '@inspetor/atoms/profile'
import { Button } from '@inspetor/components/ui/button'
import { CardHeader, CardTitle } from '@inspetor/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@inspetor/components/ui/form'
import { Input } from '@inspetor/components/ui/input'
import { firebaseModels } from '@inspetor/constants/firebase-models'
import { toast } from '@inspetor/hooks/use-toast'
import { firestore } from '@inspetor/lib/firebase/client'
import { cn } from '@inspetor/lib/utils'
import { collection, doc, updateDoc } from 'firebase/firestore'
import { useAtom, useAtomValue } from 'jotai'
import { Loader2 } from 'lucide-react'
import { parseAsString, useQueryState } from 'nuqs'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  name: z.string(),
  email: z.string().email(),
  username: z.string(),
})

type Schema = z.infer<typeof schema>

export function PersonalSection() {
  const [currentSection] = useQueryState(
    'section',
    parseAsString.withDefault('personal'),
  )

  const [profile, setProfile] = useAtom(profileAtom)
  const isProfileLoading = useAtomValue(isLoadingProfileAtom)

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
  })

  async function handleUpdateProfile(data: Schema) {
    try {
      const coll = collection(firestore, firebaseModels.users)
      const docRef = doc(coll, profile!.id)

      await updateDoc(docRef, {
        ...profile!,
        ...data,
        companyId: profile!.companyId,
        updatedAt: Date.now(),
        updatedBy: profile!.id,
      })

      setProfile({
        ...profile!,
        ...data,
        companyId: profile!.companyId,
        updatedAt: Date.now(),
        updatedBy: profile!.id,
      })

      toast({
        title: 'Perfil atualizado',
        description: 'Suas informações foram atualizadas com sucesso',
        variant: 'success',
      })
    } catch {
      toast({
        title: 'Erro ao atualizar perfil',
        description: 'Tente novamente mais tarde',
        variant: 'destructive',
      })
    }
  }

  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name,
        email: profile.email,
        username: profile.username,
      })
    }
  }, [form, profile])

  return (
    <section
      className={cn('hidden flex-col', currentSection === 'personal' && 'flex')}
    >
      <CardHeader className="px-0">
        <CardTitle>Informações Pessoais</CardTitle>
      </CardHeader>

      <Form {...form}>
        <form
          className="grid grid-cols-2 gap-4"
          onSubmit={form.handleSubmit(handleUpdateProfile)}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Nome</FormLabel>
                <FormControl>
                  <Input
                    variant="profile"
                    {...field}
                    disabled={isProfileLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">E-mail</FormLabel>
                <FormControl>
                  <Input variant="profile" type="email" {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Username</FormLabel>
                <FormControl>
                  <Input
                    variant="profile"
                    {...field}
                    disabled={isProfileLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-2 flex justify-end mt-10 gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isProfileLoading || form.formState.isSubmitting}
              onClick={() => {
                form.reset({
                  name: profile?.name ?? '',
                  email: profile?.email ?? '',
                  username: profile?.username ?? '',
                })
              }}
            >
              Resetar
            </Button>
            <Button
              variant="inspetor-blue"
              disabled={isProfileLoading || form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                'Salvar'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  )
}
