import LoginLogo from '@inspetor/assets/login-logo.png'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@inspetor/components/ui/card'
import Image from 'next/image'

import { ContactForm } from './contact-form'
import { SubmitButton } from './submit-button'

export default async function Contact() {
  return (
    <main className="flex h-screen max-h-full w-screen flex-col items-center justify-start overflow-y-auto pb-16 px-4 max-xl:pb-40 max-md:pb-40 max-sm:pb-32">
      {/* <h1 className=" w-full max-w-[850px] text-left text-3xl leading-loose text-white">
        Contato
      </h1> */}
      <Card className="bg-inspetor-dark-blue-700 shadow-lg border-0 p-0 my-auto">
        <CardContent className="flex w-[1000px] max-w-[850px] flex-col items-center justify-start rounded-xl bg-inspetor-dark-blue-700 shadow-box">
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
          <ContactForm />
          <CardFooter className="justify-end flex w-full p-0 mt-6">
            <SubmitButton />
          </CardFooter>
        </CardContent>
      </Card>
    </main>
  )
}
