import type { LoaderArgs, ActionArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useActionData, useLoaderData, useSearchParams, useNavigation } from '@remix-run/react'
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Icon,
  Flex,
  Grid,
  useToast,
} from '@chakra-ui/react'
import { FiSearch, FiX } from 'react-icons/fi'
import { F } from '@mobily/ts-belt'
import { useRef, useEffect } from 'react'
import invariant from 'tiny-invariant'

import { DiscoverCard, PageHeader } from '~/components'
import { toggleSubscription } from '~/api/subscriptions.server'
import { getSupabaseSession } from '~/api/auth.server'

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  const action = formData.get('action') as string | undefined
  const listId = formData.get('listId') as string | undefined
  invariant(listId, 'listId is required')
  invariant(action, 'action is required')
  invariant(action === 'subscribe' || action === 'unsubscribe', 'action must be subscribe or unsubscribe')

  const { error, response } = await toggleSubscription(request, action, listId)

  return json({ error }, { headers: response.headers })
}

export const loader = async ({ request }: LoaderArgs) => {
  const { session, supabase, response } = await getSupabaseSession(request)
  if (!session) {
    return redirect('/login')
  }

  const { data: subscriptions, error: subscriptionsError } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('subscriber_id', session.user.id)

  if (subscriptionsError) {
    throw new Error(subscriptionsError.message)
  }

  let url = new URL(request.url)
  let { q } = Object.fromEntries(url.searchParams)

  if (q) {
    const { data, error } = await supabase
      .from('lists')
      .select('*, tags (*)')
      .ilike('name', `%${q}%`)
      .eq('visibility', 'public')

    const { data: tags, error: tagsError } = await supabase
      .from('tags')
      .select('lists (*, tags(*))')
      .ilike('name', `%${q}%`)

    if (error || tagsError) {
      throw new Error(error?.message || tagsError?.message)
    }

    const flatTagLists = tags.flatMap((tag) => tag.lists).filter(Boolean)
    const lists = [...data]
    flatTagLists.forEach((list) => {
      if (list && !lists.some((l) => l.id === list.id)) {
        lists.push(list)
      }
    })

    return json({ lists, subscriptions }, { headers: response.headers })
  } else {
    const { data: lists, error } = await supabase.from('lists').select('*, tags(*)').eq('visibility', 'public')

    if (error) {
      throw new Error(error.message)
    }

    return json({ lists, subscriptions }, { headers: response.headers })
  }
}

export default function Discover() {
  const { lists, subscriptions } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()

  const error = actionData && 'error' in actionData ? actionData.error : undefined

  const toast = useToast()

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        status: 'error',
        duration: 5000,
      })
    }
  }, [error, toast])

  const navigation = useNavigation()
  const [searchParams, setSearchParams] = useSearchParams()

  const isSubmitting = ['submitting', 'loading'].includes(navigation.state)

  const searchRef = useRef<HTMLInputElement>(null)

  const debouncedSubmit = F.debounce((value) => {
    if (value.length >= 3) {
      setSearchParams({ q: value })
    } else if (searchParams.get('q')) {
      searchParams.delete('q')
      setSearchParams(searchParams)
    }
  }, 1000)

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    debouncedSubmit(value)
  }

  const clearSearch = () => {
    if (searchRef.current) {
      searchRef.current.value = ''
    }
    searchParams.delete('q')
    setSearchParams(searchParams)
  }

  return (
    <Box height="100%">
      <PageHeader title="Discover">
        <Flex justifyContent="flex-end">
          <InputGroup>
            <InputLeftElement pointerEvents="none" children={<Icon as={FiSearch} color="gray.300" />} />
            <Input
              placeholder="Search by list name or tag"
              variant="filled"
              width="300px"
              onChange={handleSearch}
              name="search"
              ref={searchRef}
            />
            <InputRightElement children={<Icon as={FiX} color="gray.500" onClick={clearSearch} />} />
          </InputGroup>
        </Flex>
      </PageHeader>

      <Grid gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap="12px" maxWidth="1200px">
        {lists.map((list) => (
          <DiscoverCard key={list.id} listTags={list.tags || []} {...{ list, subscriptions, isSubmitting }} />
        ))}
      </Grid>
    </Box>
  )
}
