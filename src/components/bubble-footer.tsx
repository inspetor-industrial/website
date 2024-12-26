import { ComponentProps } from 'react'
import { IconType } from 'react-icons'
import { twMerge } from 'tailwind-merge'

type BubbleFooterProps = ComponentProps<'div'> & {
  icon: IconType
  iconSize?: 'md' | 'sm'
  text: string
}

export function BubbleFooter({
  icon: Icon,
  text,
  className,
  iconSize = 'md',
  ...rest
}: BubbleFooterProps) {
  const sizeOfIcon = iconSize === 'md' ? 65 : 55

  return (
    <div
      className={twMerge(
        'flex w-48 flex-col items-center h-full justify-center gap-4 overflow-x-auto rounded-xl !bg-white p-2 text-center transition-transform duration-500 hover:-translate-y-10 min-[700px]:mb-12',
        className,
      )}
      {...rest}
    >
      <div className="rounded-full border-2 border-inspetor-dark-blue-700">
        <div className="flex h-24 w-24 items-center justify-center rounded-full border-5 border-white bg-inspetor-dark-blue-700 opacity-100">
          <Icon size={sizeOfIcon} style={{ color: 'white' }} />
        </div>
      </div>
      <p className="whitespace-normal text-base font-semibold">{text}</p>
    </div>
  )
}
