import { Outlet, Link, useLoaderData, useParams, Link as RouterLink, useOutletContext } from '@remix-run/react'
import { type ActionArgs, type LoaderArgs, json, redirect } from '@remix-run/node'
import z from 'zod'
import { Button, Box, HStack, Stack, Icon } from '@chakra-ui/react'
import { FiPlus, FiStar } from 'react-icons/fi'
import { profanity } from '@2toad/profanity'
import invariant from 'tiny-invariant'

import { PageHeader } from '~/components/PageHeader'
import { getSupabaseSession } from '~/api/auth.server'
import createServerSupabase from '~/utils/supabase.server'

const listSchema = z.object({
  name: z.string().min(1, { message: 'List requires a name' }),
  description: z.string().optional(),
  visibility: z.enum(['public', 'private']),
})

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  const name = formData.get('name')
  const visibility = formData.get('visibility')
  const description = formData.get('description')
  const tags = formData.get('tags') as string
  const tagIds = tags ? tags.split(',') : []

  const schemaResult = listSchema.safeParse({
    name,
    description,
    visibility,
  })

  if (!schemaResult.success) {
    return json({ errors: schemaResult.error.format() })
  }

  if (profanity.exists(schemaResult.data.name)) {
    return json({
      profanityErrors: { name: 'List name contains profanity' },
    })
  }

  const response = new Response()
  const supabase = createServerSupabase({ request, response })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  invariant(user, 'You must be signed in to perform this action.')

  const { data, error } = await supabase
    .from('lists')
    .insert({
      name: schemaResult.data.name,
      visibility: schemaResult.data.visibility,
      description: schemaResult.data.description,
      user_id: user.id,
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  const tagData = tagIds.map((tagId) => ({
    id: `${tagId}-${data.id}`,
    tag_id: tagId,
    list_id: data.id,
  }))

  const { error: tagsError } = await supabase.from('lists_tags').insert(tagData)

  if (tagsError) console.error(tagsError)

  return redirect(`/lists/${data.id}`)
}

export const loader = async ({ request, params }: LoaderArgs) => {
  const { session, supabase, response } = await getSupabaseSession(request)
  if (!session) {
    return redirect('/login')
  }

  const { data, error } = await supabase
    .from('lists')
    .select('*')
    .eq('user_id', session.user.id)
    .order('name', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  const forLaterList = data.find((list) => list.visibility === 'private_for_later')
  const otherLists = data.filter((list) => list.visibility !== 'private_for_later')
  const lists = forLaterList ? [forLaterList, ...otherLists].filter(Boolean) : otherLists
  const isNewListPath = request.url.endsWith('/new')

  if (!params.listId && forLaterList && !isNewListPath) {
    return redirect(`/lists/${forLaterList.id}`)
  }

  return json({ lists }, { headers: response.headers })
}

export default function Lists() {
  const { lists } = useLoaderData<typeof loader>()
  const outletContext = useOutletContext()
  const { listId } = useParams()

  const createButton = (
    <Button as={RouterLink} colorScheme="brand" leftIcon={<Icon as={FiPlus} />} to="new" size="md" variant="outline">
      Create list
    </Button>
  )

  return (
    <Box height="100%">
      <PageHeader title="Lists">{createButton}</PageHeader>

      <Stack>
        <HStack>
          {lists.map((list) => (
            <Button
              variant={list.id === listId ? 'outline' : 'ghost'}
              key={list.id}
              as={Link}
              to={list.id}
              size="sm"
              rightIcon={list.visibility === 'private_for_later' ? <Icon as={FiStar} color="yellow.500" /> : undefined}
            >
              {list.name}
            </Button>
          ))}
        </HStack>

        <Box maxWidth="960px" width="100%">
          <Outlet context={outletContext} />
        </Box>
      </Stack>
    </Box>
  )
}
