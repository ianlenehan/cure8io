import { Text, HStack, Stack, Divider, Tag } from '@chakra-ui/react'

import type { List as ListType, ListTag, Post as PostType } from '~/types'
import { Post } from '~/components/Post'

type Props = {
  list: ListType
  tags: ListTag[] | null
  posts: PostType[]
}

export const List = ({ list, tags, posts }: Props) => {
  const hasTags = Array.isArray(tags) && tags.length > 0

  return (
    <>
      <Text color="gray.500">{list.description}</Text>
      {hasTags && (
        <HStack>
          {tags.map(({ id, name }) => (
            <Tag key={id}>{name}</Tag>
          ))}
        </HStack>
      )}
      {posts?.length ? (
        <Stack spacing="18px" paddingTop="12px">
          <Divider />
          {posts.map((post) => (
            <Post key={post.id} {...{ post }} />
          ))}
        </Stack>
      ) : (
        <div>No posts!</div>
      )}
    </>
  )
}
