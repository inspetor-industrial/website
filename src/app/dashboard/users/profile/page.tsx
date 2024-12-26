import { Card, CardContent, CardHeader } from '@inspetor/components/ui/card'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

import { LoadProfileInfo } from './components/load-profile-info'
import { LoadingDialog } from './components/loading-dialog'
import { MenuButtons } from './components/menu-buttons'
import { ProfileAvatar } from './components/profile-avatar'
import { ProfileBackground } from './components/profile-background'
import { PersonalSection } from './components/section/personal'
import { ProfessionalSection } from './components/section/professional'
import { SettingsSection } from './components/section/settings'

export default async function Profile() {
  const session = await getServerSession()

  if (!session) {
    redirect('/auth/sign-in')
  }

  return (
    <main className="grid grid-cols-4 gap-4 h-full py-4">
      <div className="h-full w-full">
        <Card className="rounded-md w-full h-fit shadow border bg-white">
          <CardContent className="w-full flex justify-center items-center flex-col gap-4 px-0">
            <ProfileBackground />

            <CardHeader className="space-y-4 -mt-24">
              <div className="">
                <ProfileAvatar />
              </div>
              <div className="flex flex-col gap-0.5 items-center justify-center">
                <p className="text-wrap text-zinc-900 font-semibold max-w-full w-full text-center">
                  {session.user.name}
                </p>
                <p className="text-wrap text-xs text-zinc-400 font-medium max-w-full w-full text-center">
                  {session.user.email}
                </p>
              </div>
            </CardHeader>
            <MenuButtons />
          </CardContent>
        </Card>
      </div>
      <div className="h-full w-full col-span-3">
        <Card className="rounded-md w-full shadow border bg-white">
          <CardContent>
            <PersonalSection />
            <ProfessionalSection />
            <SettingsSection />
          </CardContent>
        </Card>
      </div>
      <LoadingDialog />
      <LoadProfileInfo />
    </main>
  )
}
