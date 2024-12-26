import { AvatarPlaceholder } from '@inspetor/components/images/avatar-placeholder'
// import { Button } from '@inspetor/components/ui/button'
// import { Camera } from 'lucide-react'

export function ProfileAvatar() {
  return (
    <div className="w-full flex justify-center items-center relative">
      <AvatarPlaceholder />
      {/* <Button
        variant="icon"
        size="icon"
        className="absolute h-8 w-8 -bottom-1 right-1/4 bg-white hover:bg-white rounded-full shadow"
      >
        <Camera className="fill-gray-300 text-white" />
      </Button> */}
    </div>
  )
}
