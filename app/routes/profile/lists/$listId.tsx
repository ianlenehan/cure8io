import type { LoaderArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useLoaderData, Outlet, Link as RouterLink, useNavigate, useOutletContext } from '@remix-run/react'
import {
  Card,
  CardBody,
  Heading,
  Button,
  HStack,
  Stack,
  Flex,
  Icon,
  IconButton,
  ButtonGroup,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react'
import { FiPlus, FiLock, FiEdit3, FiChevronDown, FiTrash } from 'react-icons/fi'

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

  const { data: interactions } = await supabase
    .from('interactions')
    .select('action, post_id')
    .eq('list_id', params.listId)

  return json({ list: data, interactions }, { headers: response.headers })
}

export default function List() {
  const { list } = useLoaderData<typeof loader>()

  const navigate = useNavigate()

  const handleEdit = () => {
    navigate('edit')
  }

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

            <ButtonGroup isAttached variant="outline" size="sm">
              <Button size="sm" leftIcon={<FiPlus />} width="100%">
                Add post
              </Button>
              {list.visibility !== 'private_for_later' && (
                <Menu>
                  <MenuButton
                    aria-label="more-options"
                    as={IconButton}
                    data-testid="pie-combo-menu-button"
                    icon={<FiChevronDown />}
                  />
                  <MenuList>
                    <MenuItem aria-label="Edit list" icon={<FiEdit3 />} onClick={handleEdit}>
                      Edit list
                    </MenuItem>
                    <MenuItem aria-label="Delete list" icon={<FiTrash />} onClick={handleEdit}>
                      Delete list
                    </MenuItem>
                  </MenuList>
                </Menu>
              )}
            </ButtonGroup>
          </Flex>
          <Outlet context={useOutletContext()} />
        </Stack>
      </CardBody>
    </Card>
  )
}
