import type { LoaderArgs, ActionArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useLoaderData, Link as RouterLink, useActionData, useSubmit } from '@remix-run/react'
import { Box, Text, Link, Stack, Card, CardBody, useToast, StackDivider } from '@chakra-ui/react'
import invariant from 'tiny-invariant'
import { useEffect } from 'react'

import { PageHeader, Post } from '~/components'
// import type { SupabaseOutletContext } from '~/root'
import { getSupabaseSession } from '~/api/auth.server'

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  const action = formData.get('action') as string | undefined
  const postId = formData.get('postId') as string | undefined
  const listId = formData.get('listId') as string | undefined
  const url = formData.get('url') as string | undefined
  const title = formData.get('title') as string | undefined
  const author = formData.get('author') as string | undefined
  const description = formData.get('description') as string | undefined

  const { session, supabase, response } = await getSupabaseSession(request)
  invariant(session, 'You must be logged in to complete this action')

  const userId = session.user.id

  let errorMessage = ''
  let successMessage = ''

  if (action === 'click') {
    invariant(postId, 'postId is required')
    invariant(listId, 'listId is required')

    const id = `${postId}-${userId}-${listId}`
    await supabase
      .from('interactions')
      .upsert({ id, post_id: postId, user_id: userId, list_id: listId, action: 'click' })
  }

  if (action === 'save') {
    const { error: laterError, data: forLaterList } = await supabase
      .from('lists')
      .select('id')
      .eq('user_id', userId)
      .eq('visibility', 'private_for_later')
      .single()

    if (laterError) {
      return json({ errorMessage: laterError.message, successMessage }, { headers: response.headers })
    }

    invariant(postId, 'postId is required')
    invariant(listId, 'listId is required')
    invariant(url, 'url is required')
    invariant(title, 'title is required')

    const id = `${postId}-${userId}-${listId}`
    await supabase
      .from('interactions')
      .upsert({ id, post_id: postId, user_id: userId, list_id: listId, action: 'save' })

    const { error: saveError } = await supabase
      .from('posts')
      .insert({ list_id: forLaterList.id, url, title, author, description })

    if (saveError) {
      errorMessage = saveError.message
    } else {
      successMessage = 'Saved to your "For later" list'
    }
  }

  return json({ errorMessage, successMessage }, { headers: response.headers })
}

export const loader = async ({ request }: LoaderArgs) => {
  const { session, response, supabase } = await getSupabaseSession(request)

  if (!session) {
    return redirect('/login')
  }

  // const { data: posts, error: postsError } = await supabase.from('subscriptions').select('*')
  const { data: subscriptions, error: subscriptionsError } = await supabase
    .from('subscriptions')
    .select(`*, lists(*, posts(*))`)
    .eq('subscriber_id', session.user.id)

  if (subscriptionsError) {
    throw new Error(subscriptionsError.message)
  }

  const posts = subscriptions
    .flatMap((s) =>
      s.lists && 'posts' in s.lists && Array.isArray(s.lists?.posts) ? s.lists.posts?.map((p) => p) : undefined
    )
    .filter((p) => p !== null)

  const postIds = posts.map((p) => p?.id).filter(Boolean)
  const { data: interactions } = await supabase
    .from('interactions')
    .select('*')
    .in('post_id', postIds)
    .eq('user_id', session.user.id)

  return json({ subscriptions, posts, interactions }, { headers: response.headers })
}

/* 🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀 */

export default function Feed() {
  const { posts, interactions } = useLoaderData<typeof loader>()
  const { errorMessage, successMessage } = useActionData<typeof action>() || {}

  const submit = useSubmit()
  const toast = useToast()

  useEffect(() => {
    if (successMessage) {
      toast({
        title: successMessage,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    }

    if (errorMessage) {
      toast({
        title: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }, [errorMessage, successMessage, toast])

  const handleLinkClick = (data: FormData) => {
    submit(data, { method: 'POST' })
  }

  // const { supabase } = useOutletContext<SupabaseOutletContext>()

  // const signOut = async () => {
  //   const { error } = await supabase.auth.signOut()

  //   if (error) {
  //     throw error
  //   }
  // }
  return (
    <Box height="100%">
      <PageHeader title="Feed" />
      {/* <Button onClick={signOut}>Sign Out</Button> */}
      <Card maxWidth="960px">
        <CardBody>
          {!posts ? (
            <Text>
              Subscribe to some lists to start seeing posts in your feed!{' '}
              <Link as={RouterLink} to="/discover">
                Click here
              </Link>{' '}
              to discover lists to follow.
            </Text>
          ) : (
            <Stack divider={<StackDivider />} spacing="18px">
              {posts.map((post) =>
                post ? (
                  <div key={post.id}>
                    <Post
                      iconSet="feed"
                      post={post}
                      isClicked={interactions?.some(({ post_id, action }) => post_id === post.id && action === 'click')}
                      isSaved={interactions?.some(({ post_id, action }) => post_id === post.id && action === 'save')}
                      onLinkClick={handleLinkClick}
                    />
                  </div>
                ) : null
              )}
            </Stack>
          )}
        </CardBody>
      </Card>
    </Box>
  )
}
