import { cn } from '@inspetor/lib/utils'
import { sanitizeNumber } from '@inspetor/utils/sanitize-number'
import { ChangeEvent } from 'react'

import { InputProps, inputVariants } from './ui/input'

type InputWithSuffixProps = Omit<InputProps, 'onChange'> & {
  suffix: string
  onChange?: (value: string) => void
}

export function InputWithSuffix({
  suffix,
  className,
  variant = 'default',
  onChange,
  readOnly,
  ...props
}: InputWithSuffixProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange?.(sanitizeNumber(event.target.value))
  }

  return (
    <div
      className={cn(
        inputVariants({ variant }),
        'flex items-center',
        props.disabled && '!opacity-50 !cursor-not-allowed',
        !readOnly &&
          !props.disabled &&
          'read-only:!opacity-100 read-only:!cursor-text',
        className,
      )}
    >
      <input
        className={cn(
          'bg-transparent focus-within:outline-none w-full',
          readOnly && '!cursor-not-allowed',
        )}
        type="text"
        readOnly={readOnly}
        onChange={handleChange}
        {...props}
      />
      <span>{suffix}</span>
    </div>
  )
}
