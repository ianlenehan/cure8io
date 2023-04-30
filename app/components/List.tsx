import { Text, HStack, Stack, StackDivider, Tag } from '@chakra-ui/react'
import { useNavigation } from '@remix-run/react'

import type { List as ListType, ListTag, Post as PostType, Interaction } from '~/types'
import { Post } from '~/components/Post'

type Props = {
  list: ListType
  tags: ListTag[] | null
  posts: PostType[]
  interactions?: Interaction[]
  lists?: ListType[]
}

export const List = ({ list, lists, tags, posts, interactions }: Props) => {
  const hasTags = Array.isArray(tags) && tags.length > 0

  const navigation = useNavigation()

  const isProcessing = ['submitting', 'loading'].includes(navigation.state)

  return (
    <>
      <Text variant="faint">{list.description}</Text>
      {hasTags && (
        <HStack>
          {tags.map(({ id, name }) => (
            <Tag key={id}>{name}</Tag>
          ))}
        </HStack>
      )}

      {posts?.length ? (
        <Stack divider={<StackDivider />} spacing="18px" paddingTop="12px">
          {posts.map((post) => (
            <Post
              iconSet="list"
              interactions={interactions?.filter((i) => i.post_id === post.id)}
              key={post.id}
              {...{ lists, post, isProcessing }}
            />
          ))}
        </Stack>
      ) : (
        <div>No posts!</div>
      )}
    </>
  )
}
