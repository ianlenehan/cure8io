import { Box, Text, Link } from "@chakra-ui/react";
import { isFuture, format } from "date-fns";

import type { Post as PostType } from "~/types";

export const Post = ({ post }: { post: PostType }) => {
  const { url, title, author, description, publish_date } = post;
  return (
    <Box paddingX="12px">
      <Text fontSize="xl">
        <Link href={url} target="_blank">
          {title}
        </Link>
      </Text>
      <Text color="gray.600" fontSize="sm">
        {author}
      </Text>
      <Text>{description}</Text>
      <Text color="gray.500" fontSize="sm">
        {isFuture(new Date(publish_date)) ? "Scheduled for" : "Published"}{" "}
        {format(new Date(publish_date), "d MMM yyy")}
      </Text>
    </Box>
  );
};
