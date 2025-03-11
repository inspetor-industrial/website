'use client'

import { cn } from '@inspetor/lib/utils'
import UnderlineExtension from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  Bold,
  Code2,
  Eraser,
  Italic,
  Strikethrough,
  Underline,
} from 'lucide-react'
import { ComponentProps, useState } from 'react'

import { Button } from './ui/button'

export interface InspetorEditorProps extends ComponentProps<'input'> {
  containerClassName?: ComponentProps<'input'>['className']
  mainContainerClassName?: ComponentProps<'input'>['className']
  onChangeText: (htmlText: string) => void
}

export function InspetorEditor({
  className,
  containerClassName,
  onChangeText,
  value,
  disabled,
  mainContainerClassName,
}: InspetorEditorProps) {
  const [isEditorFocus, setIsEditorFocus] = useState(false)
  const [isBoldActive, setIsBoldActive] = useState(false)
  const [isItalicActive, setIsItalicActive] = useState(false)
  const [isUnderlineActive, setIsUnderlineActive] = useState(false)
  const [isStrikethroughActive, setIsStrikethroughActive] = useState(false)
  const [isCodeActive, setIsCodeActive] = useState(false)

  const editor = useEditor({
    extensions: [StarterKit, UnderlineExtension],
    editable: !disabled,
    editorProps: {
      attributes: {
        class: cn(
          'w-full min-h-[80px] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 bg-inspetor-gray-300',
          className,
        ),
      },
    },
    onFocus: () => setIsEditorFocus(true),
    onBlur: () => setIsEditorFocus(false),
    onUpdate: () => {
      if (!editor) {
        return
      }

      const html = editor.getHTML()
      onChangeText(html)
    },
    content: String(value ?? ''),
  })

  return (
    <div
      data-disabled={!!disabled}
      className={cn(
        'rounded-md data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50 group bg-inspetor-gray-300',
        isEditorFocus && 'outline-none ring-2 ring-ring ring-offset-2',
        mainContainerClassName,
      )}
    >
      <div className="h-9 bg-inspetor-gray-300 w-full border border-b-px border-input rounded-md rounded-b-none flex items-center">
        <div className="divide-x divide-input h-full">
          <Button
            type="button"
            variant="ghost"
            className={cn(
              'p-0 h-full px-3 hover:bg-slate-100 rounded-none rounded-tl-md',
              isBoldActive && 'hover:bg-slate-200 bg-slate-300',
            )}
            onClick={() => {
              if (editor?.can().setBold()) {
                editor.chain().focus().toggleBold().run()
                setIsBoldActive((state) => !state)
              }
            }}
          >
            <Bold className="size-4" strokeWidth={3} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            className={cn(
              'p-0 h-full px-3 hover:bg-slate-100 rounded-none',
              isItalicActive && 'hover:bg-slate-200 bg-slate-300',
            )}
            onClick={() => {
              if (editor?.can().setItalic()) {
                editor.chain().focus().toggleItalic().run()
              }

              setIsItalicActive((state) => !state)
            }}
          >
            <Italic className="size-4" strokeWidth={3} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            className={cn(
              'p-0 h-full px-3 hover:bg-slate-100 rounded-none',
              isCodeActive && 'hover:bg-slate-200 bg-slate-300',
            )}
            onClick={() => {
              if (editor?.can().setCode()) {
                editor.chain().focus().toggleCode().run()
              }

              setIsCodeActive((state) => !state)
            }}
          >
            <Code2 className="w-4 h-4" strokeWidth={3} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            className={cn(
              'p-0 h-full px-3 hover:bg-slate-100 rounded-none',
              isUnderlineActive && 'hover:bg-slate-200 bg-slate-300',
            )}
            onClick={() => {
              if (editor?.can().setUnderline()) {
                editor.chain().focus().toggleUnderline().run()
                setIsUnderlineActive((state) => !state)
              }
            }}
          >
            <Underline className="size-4" strokeWidth={3} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            className={cn(
              'p-0 h-full px-3 hover:bg-slate-100 rounded-none',
              isStrikethroughActive && 'hover:bg-slate-200 bg-slate-300',
            )}
            onClick={() => {
              if (editor?.can().setStrike()) {
                editor.chain().focus().toggleStrike().run()
              }

              setIsStrikethroughActive((state) => !state)
            }}
          >
            <Strikethrough className="size-4" strokeWidth={3} />
          </Button>
        </div>
        <Button
          type="button"
          variant="ghost"
          className={cn(
            'p-0 h-full px-3 hover:bg-slate-100 rounded-none ml-auto',
          )}
          onClick={() => {
            editor?.commands.clearContent()
            editor?.commands.clearNodes()
          }}
        >
          <Eraser className="size-4" strokeWidth={3} />
        </Button>
      </div>
      <EditorContent
        disabled={disabled}
        editor={editor}
        className={cn(
          'cursor-text overflow-hidden focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 overflow-y-auto flex min-h-[90px] w-full rounded-b-md border border-t-0 border-input bg-inspetor-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 group-data-[disabled=true]:cursor-not-allowed',
          containerClassName,
        )}
      />
    </div>
  )
}
