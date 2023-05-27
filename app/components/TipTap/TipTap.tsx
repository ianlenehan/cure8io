import { useState } from 'react'
import { Box, useColorModeValue, Card } from '@chakra-ui/react'
import { useEditor, EditorContent } from '@tiptap/react'
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import Link from '@tiptap/extension-link'
import TextStyle from '@tiptap/extension-text-style'
import StarterKit from '@tiptap/starter-kit'

import { MenuBar } from './MenuBar'

type Props = {
  defaultValue?: string
  name: string
}

export const TipTap = ({ defaultValue = '', name }: Props) => {
  const [value, setValue] = useState(defaultValue)

  const editor = useEditor({
    extensions: [
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle,
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
      }),
      Link,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      setValue(editor.getHTML())
    },
  })

  return (
    <Card
      bgColor="transparent"
      variant="outline"
      sx={{
        '.ProseMirror': {
          minHeight: '200px',
          // borderWidth: '1px',
          // borderColor: useColorModeValue('gray.700', 'gray.600'),
          borderRadius: '0 0 5px 5px',
          padding: '5px',
        },
        h1: {
          fontSize: 'revert',
          fontWeight: 'revert',
        },
        h2: {
          fontSize: 'revert',
          fontWeight: 'revert',
        },
        h3: {
          fontSize: 'revert',
          fontWeight: 'revert',
        },
        a: {
          cursor: 'pointer',
          textDecoration: 'underline',
        },
        ul: {
          listStyleType: 'disc',
          marginLeft: '40px',
          marginTop: '12px',
        },
        ol: {
          listStyleType: 'decimal',
          marginLeft: '40px',
          marginTop: '12px',
        },
      }}
    >
      <Box bgColor={useColorModeValue('gray.50', 'gray.800')} padding="3px">
        <MenuBar editor={editor} />
      </Box>
      <input type="hidden" name={name} value={value} />
      <EditorContent {...{ editor }} />
    </Card>
  )
}
