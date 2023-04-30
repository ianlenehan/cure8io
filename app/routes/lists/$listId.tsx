import { useEffect } from 'react'
import type { LoaderArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useLoaderData, Outlet, useNavigation, useNavigate, useOutletContext, Form, useParams } from '@remix-run/react'
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
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
  const navigation = useNavigation()
  const isDeleting = navigation.state === 'submitting'

  const { isOpen, onOpen, onClose } = useDisclosure()

  const { listId } = useParams()

  useEffect(() => {
    // close the delete modal when the listId changes
    // can't use `isOpen` as that will prevent modal from ever opening
    onClose()
  }, [onClose, listId])

  const handleEdit = () => {
    navigate('edit')
  }

  return (
    <>
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
                      <MenuItem aria-label="Delete list" icon={<FiTrash />} onClick={onOpen}>
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

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete "{list.name}"?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb="8px">
              Are you sure you want to delete your list? All posts belonging to this list will also be deleted.
            </Text>
            <Text fontWeight={600}>This action cannot be undone.</Text>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Form method="POST" action="delete">
              <Button colorScheme="red" type="submit" isLoading={isDeleting}>
                Delete
              </Button>
            </Form>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
