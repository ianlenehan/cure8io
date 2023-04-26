import type { LoaderArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useLoaderData, Outlet, Link as RouterLink } from '@remix-run/react'
import { Card, CardBody, Heading, Button, HStack, Stack, Flex, Icon } from '@chakra-ui/react'
import { FiPlus, FiLock } from 'react-icons/fi'

import { getSupabaseSession } from '~/api/auth.server'

export const loader = async ({ params, request }: LoaderArgs) => {
  const { session, supabase, response } = await getSupabaseSession(request)
  if (!session) {
    return redirect('/login')
  }

  const { data, error } = await supabase.from('lists').select(`*, tags (*), posts (*)`).eq('id', params.listId).single()

  if (error) {
    throw new Error(error.message)
  }

  return json({ list: data }, { headers: response.headers })
}

export default function List() {
  const { list } = useLoaderData<typeof loader>()

  return (
    <Card variant="outline" width="100%">
      <CardBody>
        <Stack>
          <Flex justifyContent="space-between">
            <HStack>
              <Heading as="h3" size="md">
                {list.name}{' '}
              </Heading>
              {['private', 'private_for_later'].includes(list.visibility) && (
                <Icon boxSize="14px" color="gray.500" as={FiLock} />
              )}
            </HStack>

            <Button as={RouterLink} size="sm" leftIcon={<FiPlus />} variant="outline" to="new">
              Add post
            </Button>
          </Flex>
          <Outlet />
        </Stack>
      </CardBody>
    </Card>
  )
}
