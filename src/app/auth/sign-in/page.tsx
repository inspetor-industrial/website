import LoginLogo from '@inspetor/assets/login-logo.png'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@inspetor/components/ui/card'
import { authOptions } from '@inspetor/lib/auth/next-auth'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

import { SignInForm } from './sign-form'
import { SubmitButton } from './submit-button'

export default async function Home() {
  const session = await getServerSession(authOptions)
  if (session?.user) {
    return redirect('/dashboard')
  }

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
            <SignInForm />
            <Link href="#" className="text-white text-sm underline p-0">
              Esqueci a senha?
            </Link>
          </div>
          <CardFooter className="justify-end p-6">
            <SubmitButton />
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  )
}
