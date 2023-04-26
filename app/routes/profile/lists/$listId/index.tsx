import { useRouteLoaderData } from "@remix-run/react";

import type { List as ListType, ListTag, Post as PostType } from "~/types";
import { List } from "~/components/List";

export default function ListIndex() {
  const { list } = useRouteLoaderData("routes/profile/lists/$listId") as {
    list: ListType & { tags: ListTag[]; posts: PostType[] };
  };

  const tags = Array.isArray(list.tags) ? list.tags : [];
  const posts = Array.isArray(list.posts) ? list.posts : [];

  return <List {...{ list, tags, posts }} />;
}
