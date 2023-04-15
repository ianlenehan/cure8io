import {
  Outlet,
  useSearchParams,
  Link,
  useLoaderData,
  useParams,
} from "@remix-run/react";
import {
  type ActionArgs,
  type LoaderArgs,
  json,
  redirect,
} from "@remix-run/node";
import z from "zod";
import {
  Button,
  Box,
  Divider,
  Card,
  CardBody,
  Text,
  HStack,
  Stack,
  Heading,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { FiPlus } from "react-icons/fi";
import { profanity } from "@2toad/profanity";

import { CreateListModal } from "~/components/CreateListModal";
import { ZeroState } from "~/components/ZeroState";
import createServerSupabase from "~/utils/supabase.server";

const newListSchema = z.object({
  name: z.string().min(1, { message: "List requires a name" }),
  description: z.string().optional(),
  visibility: z.enum(["public", "private"]),
});

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const name = formData.get("name");
  const visibility = formData.get("visibility");
  const description = formData.get("description");
  const tags = formData.get("tags") as string;
  const tagIds = tags ? tags.split(",") : [];

  const schemaResult = newListSchema.safeParse({
    name,
    description,
    visibility,
  });

  if (!schemaResult.success) {
    return json({ errors: schemaResult.error.format() });
  }

  if (profanity.exists(schemaResult.data.name)) {
    return json({
      profanityErrors: { name: "List name contains profanity" },
    });
  }

  const response = new Response();
  const supabase = createServerSupabase({ request, response });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return redirect("/login");
  }

  const { data, error } = await supabase
    .from("lists")
    .insert({
      name: schemaResult.data.name,
      visibility: schemaResult.data.visibility,
      description: schemaResult.data.description,
      user_id: session.user.id,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const tagData = tagIds.map((tagId) => ({
    id: `${tagId}-${data.id}`,
    tag_id: tagId,
    list_id: data.id,
  }));

  const { error: tagsError } = await supabase
    .from("lists_tags")
    .insert(tagData);

  if (tagsError) console.error(tagsError);

  return redirect(`/profile/lists/${data.id}`);
};

export const loader = async ({ request }: LoaderArgs) => {
  const response = new Response();
  const supabase = createServerSupabase({ request, response });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return redirect("/login");
  }

  const { data, error } = await supabase
    .from("lists")
    .select("*")
    .eq("user_id", session.user.id);

  if (error) {
    throw new Error(error.message);
  }

  return json({ lists: data }, { headers: response.headers });
};

export default function Lists() {
  const { lists } = useLoaderData<typeof loader>();

  const { listId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const isModalOpen = searchParams.get("create_list") === "true";

  const handleCloseModal = () => {
    searchParams.delete("create_list");
    setSearchParams(searchParams);
  };

  const handleCreate = () => {
    setSearchParams({ create_list: "true" });
  };

  const createButton = (
    <Button
      colorScheme="brand"
      leftIcon={<Icon as={FiPlus} />}
      onClick={handleCreate}
      size="md"
    >
      Create list
    </Button>
  );

  return (
    <Box height="100%">
      <Flex justifyContent="space-between">
        <Heading size="lg" marginBottom="3">
          Lists
        </Heading>
        {createButton}
      </Flex>

      {lists.length ? (
        <Stack spacing="6">
          <Divider />
          <HStack alignItems="flex-start">
            <Box maxHeight="100%" overflowY="auto" width="300px">
              <Card overflow="hidden" variant="outline">
                {lists.map((list, index) => (
                  <CardBody
                    bgColor={
                      list.id === listId
                        ? "gray.100"
                        : index % 2 == 0
                        ? undefined
                        : "gray.50"
                    }
                    key={list.id}
                    as={Link}
                    to={list.id}
                    _hover={{ bgColor: "gray.100" }}
                  >
                    <Text fontSize="lg" fontWeight={500}>
                      {list.name}
                    </Text>
                    <HStack>
                      <Text as="span" fontSize="sm" color="gray.500">
                        Created:
                      </Text>
                      <Text as="span" fontSize="sm">
                        {format(new Date(list.created_at), "d MMM yyy")}
                      </Text>
                    </HStack>
                  </CardBody>
                ))}
              </Card>
            </Box>
            <Box maxWidth="1200px" width="100%">
              <Outlet />
            </Box>
          </HStack>
        </Stack>
      ) : (
        <ZeroState>
          <Box marginTop="24px">{createButton}</Box>
        </ZeroState>
      )}
      <CreateListModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </Box>
  );
}
