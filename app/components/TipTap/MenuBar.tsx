import { Button, HStack } from '@chakra-ui/react'
import type { Editor } from '@tiptap/react'
import { HiOutlineCodeBracket } from 'react-icons/hi2'

import { AddHyperlink } from './AddHyperlink'

type MenuProps = {
  editor: Editor | null
}

export const MenuBar = ({ editor }: MenuProps) => {
  if (!editor) {
    return null
  }

  return (
    <HStack wrap="wrap">
      <Button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        variant={editor.isActive('bold') ? 'ghost' : 'ghost'}
        size="sm"
      >
        B
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        variant={editor.isActive('italic') ? 'ghost' : 'ghost'}
        size="sm"
      >
        <i>I</i>
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        variant={editor.isActive('strike') ? 'ghost' : 'ghost'}
        size="sm"
      >
        <s>S</s>
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        variant={editor.isActive('code') ? 'ghost' : 'ghost'}
        size="sm"
      >
        <HiOutlineCodeBracket />
      </Button>
      <Button
        onClick={() => editor.chain().focus().setParagraph().run()}
        variant={editor.isActive('paragraph') ? 'solid' : 'ghost'}
        size="sm"
      >
        p
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        variant={editor.isActive('heading', { level: 1 }) ? 'ghost' : 'ghost'}
        size="sm"
      >
        h1
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        variant={editor.isActive('heading', { level: 2 }) ? 'ghost' : 'ghost'}
        size="sm"
      >
        h2
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        variant={editor.isActive('heading', { level: 3 }) ? 'ghost' : 'ghost'}
        size="sm"
      >
        h3
      </Button>
      {/* <Button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        variant={editor.isActive('bulletList') ? 'solid' : 'ghost'}
        size="sm"
      >
        <HiListBullet />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        variant={editor.isActive('orderedList') ? 'ghost' : 'ghost'}
        size="sm"
      >
        <HiOutlineListBullet />
      </Button> */}
      {/* <Button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        variant={editor.isActive('blockquote') ? 'ghost' : 'ghost'}
        size="sm"
      >
        <RiDoubleQuotesL />
      </Button> */}
      <Button onClick={() => editor.chain().focus().setHorizontalRule().run()} variant="ghost" size="sm">
        hr
      </Button>
      <AddHyperlink editor={editor} />
    </HStack>
  )
}
