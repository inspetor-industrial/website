import LoginLogo from '@inspetor/assets/login-logo.png'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@inspetor/components/ui/card'
import Image from 'next/image'

import { ForgotPasswordForm } from './sign-form'
import { SubmitButton } from './submit-button'

export default function ForgotPasswordPage() {
  return (
    <div className="flex justify-center items-center h-max">
      <Card className="bg-inspetor-dark-blue-700 shadow-lg border-0 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <CardContent className="bg-inspetor-dark-blue-700 rounded-xl p-0 w-[500px]">
          <CardHeader className="items-center">
            <Image
              src={LoginLogo}
              alt="Inspetor"
              quality={100}
              width={100}
              height={100}
              className="w-40"
            />
          </CardHeader>
          <div className="px-8 mb-4">
            <ForgotPasswordForm />
            <CardDescription className="text-zinc-400 text-sm">
              Insira seu e-mail para receber um link de redefinição de senha.
            </CardDescription>
          </div>
          <CardFooter className="justify-end p-6">
            <SubmitButton />
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  )
}
