import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Select,
  Stack,
  Textarea,
  useBoolean,
} from '@chakra-ui/react'
import { Form, useActionData, useOutletContext } from '@remix-run/react'
import ReactSelect from 'react-select/creatable'
import type { MultiValue } from 'react-select'
import { useState } from 'react'
import { profanity } from '@2toad/profanity'

import type { action } from '~/routes/lists'
import type { SupabaseOutletContext } from '~/root'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export const CreateListModal = ({ isOpen, onClose }: Props) => {
  const actionData = useActionData<typeof action>()

  const [isLoading, setLoading] = useBoolean()
  const [tagOptions, setTagOptions] = useState<{ label: string; value: string }[]>([])
  const [selectedTags, setSelectedTags] = useState<MultiValue<{ label: string; value: string }>>([])

  const { supabase } = useOutletContext<SupabaseOutletContext>()

  const errors = actionData && 'errors' in actionData ? actionData.errors : undefined
  const profanityErrors = actionData && 'profanityErrors' in actionData ? actionData.profanityErrors : undefined

  const getTags = async (searchValue: string) => {
    setLoading.on()
    const { data, error } = await supabase.from('tags').select('*').filter('name', 'ilike', `%${searchValue}%`)

    setLoading.off()

    if (error) {
      throw new Error(error.message)
    }

    setTagOptions(data.map((tag) => ({ value: tag.id, label: tag.name })))
  }

  const handleCreateTag = async (inputValue: string) => {
    if (profanity.exists(inputValue)) {
      console.error('Profanity is not allowed')
      return
    }

    if (inputValue.length < 3) {
      console.error('Tag must be at least 3 characters')
      return
    }

    setLoading.on()
    const { data, error } = await supabase
      .from('tags')
      .insert({ name: inputValue.trim().toLowerCase() })
      .select()
      .single()

    setLoading.off()
    if (error) {
      throw new Error(error.message)
    }

    if (data) {
      setSelectedTags([...selectedTags, { value: data.id, label: data.name }])
    }
  }

  const loadTags = (inputValue: string) => {
    if (inputValue.length < 3) return

    setTimeout(() => {
      getTags(inputValue)
    }, 300)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <Form method="post" action="/lists?create_list=true">
          <ModalHeader>Create new list</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing="18px">
              <FormControl id="name" isInvalid={!!errors?.name || !!profanityErrors?.name}>
                <FormLabel>List name</FormLabel>
                <Input name="name" />
                <FormErrorMessage>{errors?.name?._errors || profanityErrors?.name}</FormErrorMessage>
              </FormControl>
              <FormControl id="visibility" isInvalid={!!errors?.visibility}>
                <FormLabel>Visibility</FormLabel>
                <Select name="visibility">
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </Select>
                <FormErrorMessage>{errors?.visibility?._errors}</FormErrorMessage>
              </FormControl>

              <FormControl id="tags">
                <FormLabel>Tags</FormLabel>
                <Input type="hidden" name="tags" value={selectedTags.map((t) => t.value).join(',')} />
                <ReactSelect
                  onInputChange={loadTags}
                  options={tagOptions}
                  onCreateOption={handleCreateTag}
                  onChange={(newValue) => setSelectedTags(newValue)}
                  isMulti
                  value={selectedTags}
                  placeholder="Type to search or create..."
                  {...{ isLoading }}
                />
              </FormControl>

              <FormControl id="description" isInvalid={!!errors?.description}>
                <FormLabel>Description</FormLabel>
                <Textarea name="description" />
                <FormErrorMessage>{errors?.visibility?._errors}</FormErrorMessage>
              </FormControl>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="brand" type="submit">
              Save
            </Button>
          </ModalFooter>
        </Form>
      </ModalContent>
    </Modal>
  )
}
