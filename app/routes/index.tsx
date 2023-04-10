import { Container, Stack, Text, Image, Button } from "@chakra-ui/react";
import { json, type LoaderArgs } from "@remix-run/node";
import { useLoaderData, useOutletContext } from "@remix-run/react";

import createServerSupabase from "~/utils/supabase.server";
import type { SupabaseOutletContext } from "~/root";

// https://remix.run/api/conventions#meta
export let meta = () => {
  return {
    title: "Cure8",
    description:
      "Cureate content for you and your friends from anywhere on the web!",
  };
};

export const loader = async ({ request }: LoaderArgs) => {
  const response = new Response();
  const supabase = createServerSupabase({ request, response });
  const session = await supabase.auth.getSession();
  console.log("🚀 ~ file: index.tsx:21 ~ loader ~ session:", session);
  const { data, error } = await supabase.from("test").select();
  console.log("🚀 ~ file: index.tsx:21 ~ loader ~ error:", error);
  return json({ test: data || [] }, { headers: response.headers });
};

// https://remix.run/guides/routing#index-routes
export default function Index() {
  const data = useLoaderData<typeof loader>();
  console.log(data);

  const { supabase } = useOutletContext<SupabaseOutletContext>();

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: "123@123.com",
      password: "password",
    });
  };

  const signUp = async () => {
    const { error } = await supabase.auth.signUp({
      email: "123@123.com",
      password: "password",
    });
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
  };

  return (
    <Container maxW={"5xl"}>
      <Button onClick={signUp}>Sign Up</Button>
      <Button onClick={signIn}>Sign In</Button>
      <Button onClick={signOut}>Sign Out</Button>
      <Stack
        textAlign={"center"}
        align={"center"}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 40, md: 28 }}
      >
        <div>
          <Text fontSize="6xl" fontWeight="extrabold">
            Love{" "}
            <Text
              as="span"
              bgGradient="linear(to-r, brand.200, brand.800)"
              bgClip="text"
              fontSize="6xl"
              fontWeight="extrabold"
            >
              newsletters
            </Text>{" "}
            but
          </Text>
          <Text fontSize="6xl" fontWeight="extrabold">
            hate a{" "}
            <Text
              as="span"
              bgClip="text"
              bgGradient="linear(to-r, brand.200, brand.800)"
              fontWeight="extrabold"
              fontSize="6xl"
            >
              cluttered inbox
            </Text>
            ?
          </Text>
        </div>
        <Text fontSize="6xl" fontWeight="extrabold">
          Meet{" "}
          <Text
            as="span"
            bgClip="text"
            bgGradient="linear(to-r, brand.200, brand.800)"
            fontSize="6xl"
            fontWeight="extrabold"
          >
            Cure8
          </Text>
          .
        </Text>

        <div>
          <Text fontSize="1.3rem">
            Follow your favourite public lists. Or create your own.
          </Text>
          <Text fontSize="1.3rem">
            Save articles to read later. Share with friends.
          </Text>
        </div>

        <Image
          alt="Cure8 Logo"
          borderRadius="2xl"
          src="LogoText@0.25x.png"
          width="150px"
        />

        <Text fontSize="1.5rem" fontWeight="semibold">
          Coming soon.
        </Text>
      </Stack>
    </Container>
  );
}
