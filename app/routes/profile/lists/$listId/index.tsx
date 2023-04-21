import { useRouteLoaderData } from "@remix-run/react";
import { Text, Tag, HStack, Stack, Divider } from "@chakra-ui/react";

import type { List as ListType, ListTag, Post as PostType } from "~/types";
import { Post } from "~/components/Post";

export default function ListIndex() {
  const { list } = useRouteLoaderData("routes/profile/lists/$listId") as {
    list: ListType & { tags: ListTag[]; posts: PostType[] };
  };

  const { tags } = list;
  const hasTags = Array.isArray(tags) && tags.length > 0;

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
      {list.posts?.length ? (
        <Stack spacing="18px" paddingTop="12px">
          <Divider />
          {list.posts.map((post) => (
            <Post key={post.id} {...{ post }} />
          ))}
        </Stack>
      ) : (
        <div>No posts!</div>
      )}
    </>
  );
}
