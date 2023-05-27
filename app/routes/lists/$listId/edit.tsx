import { Box } from '@chakra-ui/react'
import { useRouteLoaderData, useActionData, useNavigation } from '@remix-run/react'
import type { ActionArgs } from '@remix-run/node'

import type { List, ListTag } from '~/types'
import { ListForm } from '~/components'
import { updateList } from '~/api/lists.server'
import type { ListErrors } from '~/types'
import invariant from 'tiny-invariant'

export const action = async ({ params, request }: ActionArgs) => {
  const listId = params.listId
  invariant(listId, 'listId is required')

  return updateList(request, listId)
}

export default function EditList() {
  const { list } = useRouteLoaderData('routes/lists/$listId') as {
    list: List & { tags: ListTag[] }
  }

  const actionData = useActionData<typeof action>()

  const errors: ListErrors | undefined = actionData && 'errors' in actionData ? actionData.errors : undefined
  const profanityErrors: { name: string } | undefined =
    actionData && 'profanityErrors' in actionData ? actionData.profanityErrors : undefined

  const navigation = useNavigation()
  const isProcessing = ['submitting', 'loading'].includes(navigation.state)

  return (
    <Box paddingTop="24px">
      <ListForm {...{ list, isProcessing, errors, profanityErrors }} />
    </Box>
  )
}
