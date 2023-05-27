import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Select,
  Stack,
  Textarea,
  useBoolean,
  Flex,
  ButtonGroup,
  Button,
} from '@chakra-ui/react'
import { Form, useOutletContext, useNavigate } from '@remix-run/react'
import { CreatableSelect } from 'chakra-react-select'
import type { MultiValue } from 'react-select'
import { useState } from 'react'
import { profanity } from '@2toad/profanity'

import type { SupabaseOutletContext } from '~/root'
import type { ListErrors, List, ListTag } from '~/types'

type Props = {
  errors?: ListErrors
  profanityErrors?: { name: string }
  isProcessing: boolean
  list?: List & { tags: ListTag[] }
}

export const ListForm = ({ errors, profanityErrors, isProcessing, list }: Props) => {
  const [isLoading, setLoading] = useBoolean()
  const [tagOptions, setTagOptions] = useState<{ label: string; value: string }[]>([])
  const [selectedTags, setSelectedTags] = useState<MultiValue<{ label: string; value: string }>>(() => {
    return list?.tags.map(({ id, name }) => ({ value: id, label: name })) || []
  })

  const { supabase } = useOutletContext<SupabaseOutletContext>()

  const navigate = useNavigate()

  const getTags = async (searchValue: string) => {
    setLoading.on()
    const { data, error } = await supabase.from('tags').select('*').filter('name', 'ilike', `%${searchValue}%`)

    setLoading.off()

    if (error) {
      throw new Error(error.message)
    }

    setTagOptions(data.map((tag) => ({ value: tag.id, label: tag.name })))
  }

  const handleCancel = () => {
    navigate(-1)
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
    <Form method="post">
      <Stack spacing="18px">
        <FormControl id="name" isInvalid={!!errors?.name || !!profanityErrors?.name}>
          <FormLabel>List name</FormLabel>
          <Input name="name" defaultValue={list?.name} />
          <FormErrorMessage>{errors?.name || profanityErrors?.name}</FormErrorMessage>
        </FormControl>
        <FormControl id="visibility" isInvalid={!!errors?.visibility}>
          <FormLabel>Visibility</FormLabel>
          <Select defaultValue={list?.visibility} name="visibility">
            <option value="public">Public</option>
            <option value="private">Private</option>
          </Select>
          <FormErrorMessage>{errors?.visibility}</FormErrorMessage>
        </FormControl>
        <FormControl id="tags">
          <FormLabel>Tags</FormLabel>
          <Input type="hidden" name="tags" value={selectedTags.map((t) => t.value).join(',')} />
          <CreatableSelect
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
          <Textarea defaultValue={list?.description || ''} name="description" />
          <FormErrorMessage>{errors?.description}</FormErrorMessage>
        </FormControl>
        <Flex justifyContent="flex-end">
          <ButtonGroup>
            <Button type="button" onClick={handleCancel} variant="ghost">
              Cancel
            </Button>
            <Button colorScheme="brand" isLoading={isProcessing} width="100px" type="submit">
              Save
            </Button>
          </ButtonGroup>
        </Flex>
      </Stack>
    </Form>
  )
}
