import { useState } from 'react'
import {
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  Text,
  ModalFooter,
  Input,
  Button,
  useDisclosure,
  useColorModeValue,
  ModalHeader,
  ButtonGroup,
} from '@chakra-ui/react'
import { HiLink } from 'react-icons/hi2'
import type { Editor } from '@tiptap/react'
import z from 'zod'

const urlSchema = z.string().url()

type Props = {
  editor: Editor | null
}

export const AddHyperlink = ({ editor }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [inputText, setInputText] = useState('https://')
  const [error, setError] = useState('')

  const color = useColorModeValue('gray.700', 'gray.100')

  if (!editor) return null

  // sets the hyperlink to the text
  const setLink = () => {
    setError('')
    const res = urlSchema.safeParse(inputText)
    if (!res.success) {
      setError('Please enter a valid url')
      return
    }
    if (inputText) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: inputText }).run()
    }
    onClose()
  }

  return (
    <>
      <Button onClick={onOpen} variant={editor.isActive('link') ? 'outline' : 'ghost'} size="sm" type="button">
        <HiLink />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color={color}>Add Link</ModalHeader>
          <ModalBody>
            <Text color={color} marginBottom="6px">
              Type a url for your link
            </Text>
            <Input color={color} value={inputText} onChange={(e) => setInputText(e.target.value)} />
            {!!error && (
              <Text size="sm" color="red">
                {error}
              </Text>
            )}
          </ModalBody>
          <ModalFooter>
            <ButtonGroup>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="brand" onClick={setLink}>
                Submit
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
