import type { ActionArgs } from '@remix-run/node'
import { useActionData, useNavigation } from '@remix-run/react'
import { Card, CardBody, CardHeader, Heading } from '@chakra-ui/react'

import { ListForm } from '~/components'
import { createList } from '~/api/lists.server'
import type { ListErrors } from '~/types'

export const action = async ({ request }: ActionArgs) => {
  return createList(request)
}

export default function NewList() {
  const actionData = useActionData<typeof action>()

  const errors: ListErrors | undefined = actionData && 'errors' in actionData ? actionData.errors : undefined
  const profanityErrors: { name: string } | undefined =
    actionData && 'profanityErrors' in actionData ? actionData.profanityErrors : undefined

  const navigation = useNavigation()
  const isProcessing = ['submitting', 'loading'].includes(navigation.state)

  return (
    <Card>
      <CardHeader>
        <Heading as="h3" size="md">
          Create a new list
        </Heading>
      </CardHeader>
      <CardBody>
        <ListForm {...{ errors, profanityErrors, isProcessing }} />
      </CardBody>
    </Card>
  )
}
