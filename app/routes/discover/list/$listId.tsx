import type { LoaderArgs, ActionArgs } from '@remix-run/node'
import { useLoaderData, Form, useNavigation } from '@remix-run/react'
import { redirect, json } from '@remix-run/node'
import { Flex, Card, CardBody, HStack, Heading } from '@chakra-ui/react'
import invariant from 'tiny-invariant'

import { getSupabaseSession } from '~/api/auth.server'
import { toggleSubscription, getSubscriptions } from '~/api/subscriptions.server'
import { isSubscribed } from '~/utils/helpers'
import { PageHeader, List, SubscribeButton } from '~/components'

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

export const loader = async ({ params, request }: LoaderArgs) => {
  const { session, supabase, response } = await getSupabaseSession(request)
  if (!session) {
    return redirect('/login')
  }

  const { subscriptions } = await getSubscriptions(request)

  const { data: list, error } = await supabase
    .from('lists')
    .select('*, tags(*), posts(*)')
    .eq('id', params.listId)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  const isSubscribedToList = isSubscribed(list.id, subscriptions)

  return json({ list, isSubscribedToList }, { headers: response.headers })
}

export default function ListIndex() {
  const { list, isSubscribedToList } = useLoaderData<typeof loader>()
  const tags = Array.isArray(list.tags) ? list.tags : []
  const posts = Array.isArray(list.posts) ? list.posts : []

  const navigation = useNavigation()
  const isSubmitting = ['submitting', 'loading'].includes(navigation.state)

  return (
    <div>
      <PageHeader title={list.name}>
        <Flex alignItems="flex-end"></Flex>
      </PageHeader>

      <Card maxWidth="1200px">
        <CardBody>
          <Flex justifyContent="space-between">
            <Heading as="h3" size="md">
              {list.name}{' '}
            </Heading>

            <Form method="post">
              <input type="hidden" name="listId" value={list.id} />
              <SubscribeButton isDisabled={isSubmitting} isSubscribed={isSubscribedToList} size="md" />
            </Form>
          </Flex>
          <List {...{ list, tags, posts }} />
        </CardBody>
      </Card>
    </div>
  )
}
