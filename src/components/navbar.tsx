import NavbarLogo from '@inspetor/assets/navbar-logo.png'
import { authOptions } from '@inspetor/lib/auth/next-auth'
import Image from 'next/image'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { IoMdLogIn } from 'react-icons/io'

export async function Navbar() {
  const session = await getServerSession(authOptions)
  const hasUserLogged = !!session?.user

  return (
    <nav className="bg-inspetor-dark-blue-700 flex h-16 w-screen items-center justify-between px-2">
      <Link href="/">
        <Image
          src={NavbarLogo}
          alt="Inspetor"
          quality={100}
          width={120}
          height={120}
        />
      </Link>

      <div className="flex items-center gap-3">
        <Link href="/" className="font-light text-white">
          Home
        </Link>
        <span className="text-white max-lg:hidden">|</span>
        <Link href="/institutional" className="font-light text-white">
          Institucional
        </Link>
        <span className="text-white max-lg:hidden">|</span>
        <Link href="/services" className="font-light text-white">
          Serviços
        </Link>
        <span className="text-white max-lg:hidden">|</span>
        <Link href="/contact" className="font-light text-white">
          Contato
        </Link>
        {hasUserLogged ? (
          <Link
            href="/dashboard"
            className="bg-inspetor-gray-300 px-3 py-1 rounded-full font-semibold flex items-center gap-2"
          >
            <IoMdLogIn className="size-6" />
            <span>{session.user?.name}</span>
          </Link>
        ) : (
          <Link
            href="/auth/sign-in"
            className="bg-inspetor-gray-300 px-3 py-1 rounded-full font-semibold flex items-center gap-2"
          >
            <IoMdLogIn className="size-6" />
            <span>Login</span>
          </Link>
        )}
      </div>
    </nav>
  )
}
