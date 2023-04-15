import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  Card,
  CardBody,
  Heading,
  Button,
  Text,
  Tag,
  HStack,
  Stack,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { FiPlus, FiLock } from "react-icons/fi";

import createServerSupabase from "~/utils/supabase.server";

export const loader = async ({ params, request }: LoaderArgs) => {
  const response = new Response();
  const supabase = createServerSupabase({ request, response });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return redirect("/login");
  }

  // const { data, error } = await supabase
  //   .from("lists")
  //   .select(
  //     `
  //   *,
  //   tags (*)
  // `
  //   )
  //   .eq("id", params.listId)
  //   .single();

  const { data, error } = await supabase
    .from("lists")
    .select(
      `*,
    tags (
      *
    )`
    )
    .eq("id", params.listId)
    .single();

  if (error) {
    console.log("🚀 ~ file: $listId.tsx:31 ~ loader ~ error:", error);
    throw new Error(error.message);
  }

  return json({ list: data }, { headers: response.headers });
};

export default function List() {
  const { list } = useLoaderData<typeof loader>();
  console.log("🚀 ~ file: $listId.tsx:34 ~ List ~ list:", list);

  const { tags } = list;
  const hasTags = Array.isArray(tags) && tags.length > 0;

  return (
    <Card variant="outline" width="100%">
      <CardBody>
        <Stack>
          <Flex justifyContent="space-between">
            <HStack>
              <Heading as="h3" size="md">
                {list.name}{" "}
              </Heading>
              {list.visibility === "private" && (
                <Icon boxSize="14px" color="gray.500" as={FiLock} />
              )}
            </HStack>

            <Button size="sm" leftIcon={<FiPlus />} variant="outline">
              Add post
            </Button>
          </Flex>
          <Text color="gray.500">{list.description}</Text>
          {hasTags && (
            <HStack>
              {tags.map(({ id, name }) => (
                <Tag key={id}>{name}</Tag>
              ))}
            </HStack>
          )}
        </Stack>
      </CardBody>
    </Card>
  );
}
