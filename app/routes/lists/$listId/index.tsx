import { useActionData, useLoaderData, useRouteLoaderData } from '@remix-run/react'
import { json, type ActionArgs, type LoaderArgs } from '@remix-run/node'
import invariant from 'tiny-invariant'
import { useToast } from '@chakra-ui/react'
import { useEffect } from 'react'

import type { List as ListType, ListTag, Post as PostType, Interaction } from '~/types'
import { List } from '~/components/List'
import { getSupabaseSession } from '~/api/auth.server'

export const action = async ({ request }: ActionArgs) => {
  const { session, supabase, response } = await getSupabaseSession(request)
  invariant(session, 'You must be logged in to complete this action')

  const formData = await request.formData()
  const action = formData.get('action') as string | undefined
  const move = formData.get('move') as string | undefined
  const postId = formData.get('postId') as string | undefined

  let errorMessage = ''
  let successMessage = ''

  if (action === 'delete') {
    invariant(postId, 'postId is required')

    const { error: deleteError } = await supabase.from('posts').delete().eq('id', postId)
    if (deleteError) {
      errorMessage = deleteError.message
    } else {
      successMessage = 'Post deleted'
    }
  }

  if (move) {
    const newListId = move
    invariant(postId, 'postId is required')
    const { error: moveError } = await supabase.from('posts').update({ list_id: newListId }).eq('id', postId)

    if (moveError) {
      errorMessage = moveError.message
    }
  }

  return json({ errorMessage, successMessage }, { headers: response.headers })
}

export const loader = async ({ params, request }: LoaderArgs) => {
  const { session, supabase, response } = await getSupabaseSession(request)
  invariant(session, 'You must be logged in to complete this action')

  const { data, error } = await supabase
    .from('lists')
    .select('*')
    .eq('user_id', session.user.id)
    .order('name', { ascending: true })

  if (error) {
    console.log(error.message)
  }

  const lists = data?.filter((list) => list.id !== params.listId) ?? []

  return json({ lists }, { headers: response.headers })
}

export default function ListIndex() {
  const { list, interactions } = useRouteLoaderData('routes/lists/$listId') as {
    list: ListType & { tags: ListTag[]; posts: PostType[] }
    interactions: Interaction[]
  }

  const { lists } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()

  const toast = useToast()

  useEffect(() => {
    if (!actionData) return

    if (actionData.errorMessage) {
      toast({
        title: 'Error',
        description: actionData.errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
    if (actionData.successMessage) {
      toast({
        title: 'Success',
        description: actionData.successMessage,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    }
  }, [actionData, toast])

  const tags = Array.isArray(list.tags) ? list.tags : []
  const posts = Array.isArray(list.posts) ? list.posts : []

  return <List {...{ list, lists, tags, posts, interactions }} />
}
