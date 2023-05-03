import {
  Box,
  Text,
  Link,
  Flex,
  HStack,
  IconButton,
  Icon,
  useColorModeValue,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react'
import { isFuture, format } from 'date-fns'
import { FiCheckCircle, FiPlus, FiTrash, FiSave, FiArrowRight } from 'react-icons/fi'
import { HiOutlineCursorClick } from 'react-icons/hi'
import { Form } from '@remix-run/react'

import type { Interaction, Post as PostType, List } from '~/types'

type Props = {
  post: PostType
  iconSet?: 'feed' | 'list'
  isClicked?: boolean
  isSaved?: boolean
  isProcessing?: boolean
  onLinkClick?(formData: FormData): void
  interactions?: Interaction[]
  lists?: List[]
}

export const Post = ({ post, iconSet, isClicked, isProcessing, isSaved, onLinkClick, interactions, lists }: Props) => {
  const { url, title, author, description, publish_date, list_id } = post
  console.log('🚀 ~ file: Post.tsx:36 ~ Post ~ description:', description)

  const numberOfClicks = interactions?.filter((i) => i.action === 'click')?.length
  const numberOfSaves = interactions?.filter((i) => i.action === 'save')?.length

  const interactionColor = useColorModeValue('gray.500', 'gray.400')
  const plusColor = useColorModeValue('gray.600', 'gray.200')

  const handleLinkClick = () => {
    const formData = new FormData()
    formData.set('action', 'click')
    formData.set('postId', post.id)
    formData.set('listId', list_id)
    onLinkClick?.(formData)
  }

  const inputs = (
    <>
      <input type="hidden" name="postId" value={post.id} />
      <input type="hidden" name="title" value={title} />
      <input type="hidden" name="author" value={author || ''} />
      <input type="hidden" name="url" value={url} />
      <input type="hidden" name="description" value={description || ''} />
      <input type="hidden" name="listId" value={list_id} />
    </>
  )

  const renderIcons = () => {
    switch (iconSet) {
      case 'feed':
        return (
          <Form method="post">
            <HStack>
              {inputs}
              <IconButton
                name="action"
                value={isSaved ? undefined : 'save'}
                aria-label="Save icon"
                icon={isSaved ? <FiCheckCircle /> : <FiPlus />}
                size="md"
                variant="ghost"
                colorScheme={isSaved ? 'brand' : 'grey'}
                type="submit"
                isDisabled={isProcessing}
              />
            </HStack>
          </Form>
        )
      case 'list':
        return (
          <Form method="post">
            <HStack>
              {inputs}
              !!
              {lists?.length && (
                <Menu>
                  <MenuButton
                    as={IconButton}
                    aria-label="Move to list"
                    variant="ghost"
                    icon={<FiArrowRight />}
                    size="sm"
                  >
                    Move
                  </MenuButton>
                  <MenuList>
                    {lists.map((list) => (
                      <MenuItem key={list.id} value={list.id} name="move" type="submit">
                        {list.name}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              )}
              <IconButton
                name="action"
                value="delete"
                aria-label="Delete button"
                icon={<FiTrash />}
                size="md"
                variant="ghost"
                type="submit"
                isDisabled={isProcessing}
                _hover={{ color: 'red.600' }}
              />
            </HStack>
          </Form>
        )

      default:
        return null
    }
  }

  return (
    <Box paddingX="12px" opacity={isClicked ? 0.6 : 1}>
      <HStack justifyContent="space-between">
        <Text fontSize="xl">
          <Link href={url} onClick={handleLinkClick} target="_blank">
            {title}
          </Link>
        </Text>
        {renderIcons()}
      </HStack>
      <Text variant="faint" fontSize="sm">
        {author}
      </Text>
      {!!description && (
        <Box
          dangerouslySetInnerHTML={{ __html: description }}
          sx={{
            h1: {
              fontSize: 'revert',
              fontWeight: 'revert',
            },
            h2: {
              fontSize: 'revert',
              fontWeight: 'revert',
            },
            h3: {
              fontSize: 'revert',
              fontWeight: 'revert',
            },
            a: {
              cursor: 'pointer',
              textDecoration: 'underline',
            },
          }}
        />
      )}
      <Flex justifyContent="space-between" marginTop="6px">
        <Text variant="faint" fontSize="sm">
          {isFuture(new Date(publish_date)) ? 'Scheduled for' : 'Published'}{' '}
          {format(new Date(publish_date), 'd MMM yyy')}
        </Text>

        {numberOfClicks || numberOfSaves ? (
          <HStack>
            {numberOfClicks && (
              <Tooltip label={`${numberOfClicks} clicks`}>
                <HStack spacing="3px">
                  <Icon as={HiOutlineCursorClick} display="inline" color={interactionColor} fontSize="sm" />
                  <Text as="span" color={interactionColor} fontSize="sm" title="Saves">
                    {numberOfClicks}
                  </Text>
                </HStack>
              </Tooltip>
            )}
            {numberOfSaves && (
              <Tooltip label={`${numberOfSaves} saves`}>
                <HStack spacing="3px">
                  <Icon as={FiSave} display="inline" color={interactionColor} fontSize="sm" />
                  <Text as="span" color={interactionColor} fontSize="sm" title="Saves">
                    {numberOfSaves}
                  </Text>
                </HStack>
              </Tooltip>
            )}
          </HStack>
        ) : null}
      </Flex>
    </Box>
  )
}
