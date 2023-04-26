import { Box, Text, Link, Flex, HStack, IconButton } from '@chakra-ui/react'
import { isFuture, format } from 'date-fns'
import { FiCheckCircle, FiPlus } from 'react-icons/fi'
import { Form } from '@remix-run/react'

import type { Post as PostType } from '~/types'

type Props = {
  post: PostType
  isClicked?: boolean
  isShowingIcons?: boolean
  isSaved?: boolean
  onLinkClick?(formData: FormData): void
}

export const Post = ({ post, isClicked, isShowingIcons, isSaved, onLinkClick }: Props) => {
  const { url, title, author, description, publish_date, list_id } = post

  const handleLinkClick = () => {
    const formData = new FormData()
    formData.set('action', 'click')
    formData.set('postId', post.id)
    formData.set('listId', list_id)
    onLinkClick?.(formData)
  }

  return (
    <Box paddingX="12px" opacity={isClicked ? 0.6 : 1}>
      <Text fontSize="xl">
        <Link href={url} onClick={handleLinkClick} target="_blank">
          {title}
        </Link>
      </Text>
      <Text color="gray.600" fontSize="sm">
        {author}
      </Text>
      <Text>{description}</Text>
      <Flex justifyContent="space-between" marginTop="6px">
        {isShowingIcons && (
          <Form method="post">
            <HStack>
              <input type="hidden" name="postId" value={post.id} />
              <input type="hidden" name="title" value={title} />
              <input type="hidden" name="author" value={author || ''} />
              <input type="hidden" name="url" value={url} />
              <input type="hidden" name="description" value={description || ''} />
              <input type="hidden" name="listId" value={list_id} />
              <IconButton
                name="action"
                value="save"
                aria-label="Save icon"
                icon={isSaved ? <FiCheckCircle /> : <FiPlus />}
                size="md"
                variant="ghost"
                color={isSaved ? 'brand.700' : 'gray.600'}
                type="submit"
              />
            </HStack>
          </Form>
        )}

        <Text color="gray.500" fontSize="sm">
          {isFuture(new Date(publish_date)) ? 'Scheduled for' : 'Published'}{' '}
          {format(new Date(publish_date), 'd MMM yyy')}
        </Text>
      </Flex>
    </Box>
  )
}
