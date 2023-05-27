import { useEffect } from 'react'
import { json, redirect, type LoaderArgs } from '@remix-run/node'
import {
  useLoaderData,
  Outlet,
  useNavigation,
  useNavigate,
  useOutletContext,
  Form,
  useParams,
  useLocation,
} from '@remix-run/react'
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
import { pluralise } from '~/utils/helpers'

export const loader = async ({ params, request }: LoaderArgs) => {
  const { session, supabase, response } = await getSupabaseSession(request)
  if (!session) {
    return redirect('/login')
  }

  const { data, error } = await supabase.from('lists').select(`*, tags (*), posts (*)`).eq('id', params.listId).single()

  if (error) {
    throw new Error(error.message)
  }

  const { data: subscriptions } = await supabase.from('subscriptions').select('id').eq('list_id', params.listId)
  const { data: interactions } = await supabase
    .from('interactions')
    .select('action, post_id')
    .eq('list_id', params.listId)

  return json({ list: data, interactions, subscribed: subscriptions.length }, { headers: response.headers })
}

export default function List() {
  const { list, interactions, subscribed } = useLoaderData<typeof loader>()
  console.log('🚀 ~ file: $listId.tsx:65 ~ List ~ interactions, subscribed:', interactions, subscribed)

  const navigate = useNavigate()
  const navigation = useNavigation()
  const isDeleting = navigation.state === 'submitting'

  const { isOpen, onOpen, onClose } = useDisclosure()

  const { listId } = useParams()

  const { pathname } = useLocation()
  const isNewListPath = pathname.endsWith('/new')

  useEffect(() => {
    // close the delete modal when the listId changes
    // can't use `isOpen` as that will prevent modal from ever opening
    onClose()
  }, [onClose, listId])

  const handleEdit = () => {
    navigate('edit')
  }

  const handleAddPost = () => {
    navigate('new')
  }

  const isPrivateList = ['private', 'private_for_later'].includes(list.visibility)

  return (
    <>
      <Card variant="outline" width="100%">
        <CardBody>
          <Stack>
            <Flex justifyContent="space-between">
              <HStack>
                <Stack>
                  <Heading as="h3" size="md">
                    {list.name}{' '}
                  </Heading>
                  {!isPrivateList && (
                    <Text fontSize="xs" variant="faint">
                      {subscribed} {pluralise(subscribed, 'subscriber')}
                    </Text>
                  )}
                </Stack>
                {isPrivateList && <Icon boxSize="14px" color="gray.500" as={FiLock} />}
              </HStack>

              {!isNewListPath && (
                <ButtonGroup isAttached variant="outline" size="sm">
                  <Button onClick={handleAddPost} leftIcon={<FiPlus />} width="100%">
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
              )}
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
