import type { ActionArgs } from '@remix-run/node'

import { deleteList } from '~/api/lists.server'
import invariant from 'tiny-invariant'

export const action = async ({ params, request }: ActionArgs) => {
  const listId = params.listId
  invariant(listId, 'listId is required')

  return deleteList(request, listId)
}
