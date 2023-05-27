import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Select,
  Stack,
  Divider,
  HStack,
  Flex,
} from '@chakra-ui/react'
import { CalendarIcon, CloseIcon } from '@chakra-ui/icons'
import { redirect, json, type ActionArgs } from '@remix-run/node'
import { Form, useActionData, useRouteLoaderData, Link as RouterLink, useLoaderData } from '@remix-run/react'
import { format } from 'date-fns'
import DateTimePicker from 'react-datetime-picker'
import { useState } from 'react'
import z from 'zod'
import invariant from 'tiny-invariant'

import createServerSupabase from '~/utils/supabase.server'
import type { List } from '~/types'
import { TipTap } from '~/components'

import DateTimePickerStyles from 'react-datetime-picker/dist/DateTimePicker.css'
import CalendarStyles from 'react-calendar/dist/Calendar.css'
import ClockStyles from 'react-clock/dist/Clock.css'

const newPostSchema = z.object({
  url: z.string().url(),
  title: z.string().min(1, { message: 'Title is required' }),
  author: z.string().optional(),
  description: z.string().optional(),
  publishDate: z.string().min(1, { message: 'Publish date is required' }),
})

export const links = () => {
  return [
    { rel: 'stylesheet', href: DateTimePickerStyles },
    { rel: 'stylesheet', href: CalendarStyles },
    { rel: 'stylesheet', href: ClockStyles },
  ]
}

export const action = async ({ params, request }: ActionArgs) => {
  const { listId } = params
  invariant(listId, 'listId is required')

  const response = new Response()
  const supabase = createServerSupabase({ request, response })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return redirect('/login')
  }

  const formData = await request.formData()
  const action = formData.get('action')
  const publishDate = formData.get('publishDate') as string
  if (action === 'save-batch' && publishDate) {
    const { error } = await supabase.from('batches').insert({
      list_id: listId,
      date: publishDate,
    })

    if (error) {
      throw new Error(error.message)
    }

    return null
  }

  const url = formData.get('url')
  const title = formData.get('title')
  const author = formData.get('author')
  const description = formData.get('description')

  const schemaResult = newPostSchema.safeParse({
    url,
    title,
    author,
    description,
    publishDate,
  })

  if (!schemaResult.success) {
    return json({ errors: schemaResult.error.format() })
  }

  const { error } = await supabase.from('posts').insert({
    url: schemaResult.data.url,
    title: schemaResult.data.title,
    author: schemaResult.data.author,
    description: schemaResult.data.description,
    publish_date: schemaResult.data.publishDate,
    list_id: listId,
  })

  if (error) {
    throw new Error(error.message)
  }

  return redirect('/lists/' + listId)
}

export const loader = async ({ params, request }: ActionArgs) => {
  const { listId } = params
  invariant(listId, 'listId is required')

  const response = new Response()
  const supabase = createServerSupabase({ request, response })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return redirect('/login')
  }
  const { data, error } = await supabase
    .from('batches')
    .select('*')
    .eq('list_id', listId)
    .gte('date', new Date().toISOString())

  if (error) {
    throw new Error(error.message)
  }

  return json({ batches: data }, { headers: response.headers })
}

export default function NewPost() {
  const { list } = useRouteLoaderData('routes/lists/$listId') as {
    list: List
  }

  const { batches } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const errors = actionData && 'errors' in actionData ? actionData.errors : undefined

  const [publishDate, setPublishDate] = useState(new Date())

  return (
    <Form method="post">
      <Stack spacing="18px">
        <Divider />

        <FormControl id="url" isInvalid={!!errors?.url}>
          <FormLabel htmlFor="url">Post URL</FormLabel>
          <Input name="url" />
          <FormErrorMessage>{errors?.url?._errors}</FormErrorMessage>
        </FormControl>
        <FormControl id="title" isInvalid={!!errors?.title}>
          <FormLabel htmlFor="title">Title</FormLabel>
          <Input name="title" />
          <FormErrorMessage>{errors?.title?._errors}</FormErrorMessage>
        </FormControl>

        <FormControl id="author">
          <FormLabel htmlFor="author">Author</FormLabel>
          <Input name="author" />
        </FormControl>

        <FormControl id="description">
          <FormLabel htmlFor="description">Description</FormLabel>
          <TipTap name="description" />
        </FormControl>

        {!!batches?.length && (
          <FormControl>
            <FormLabel htmlFor="batch">Add to batch</FormLabel>
            <Select name="batch">
              {batches.map(({ id, date }) => (
                <option key={id} value={id}>
                  {format(new Date(date), 'd MMM yyy h:mm bbb OOO')}
                </option>
              ))}
            </Select>
          </FormControl>
        )}

        <FormControl isInvalid={!!errors?.publishDate}>
          <FormLabel htmlFor="publishDate">Publish date and time</FormLabel>
          <HStack>
            <Input
              as={DateTimePicker}
              calendarIcon={<CalendarIcon color="gray.600" />}
              clearIcon={<CloseIcon color="gray.600" />}
              name="publishDate"
              format="d MMM yyy h:mm a"
              value={publishDate}
              onChange={setPublishDate}
              sx={{ '.react-datetime-picker__wrapper': { border: 'none' } }}
            />

            <div>
              <Button type="submit" name="action" value="save-batch" variant="outline">
                Save as batch
              </Button>
            </div>
          </HStack>
          <FormErrorMessage>{errors?.publishDate?._errors}</FormErrorMessage>
        </FormControl>

        <Flex justifyContent="flex-end">
          <ButtonGroup>
            <Button as={RouterLink} variant="outline" to={`/lists/${list.id}`}>
              Cancel
            </Button>
            <Button type="submit" colorScheme="brand">
              Save
            </Button>
          </ButtonGroup>
        </Flex>
      </Stack>
    </Form>
  )
}
