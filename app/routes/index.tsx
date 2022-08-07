import { useLoaderData } from "@remix-run/react";
import { Link as RemixLink } from "@remix-run/react";
import {
  Container,
  Stack,
  Heading,
  Text,
  Image,
  Button,
} from "@chakra-ui/react";

import { signOut, getUserSession } from "~/utils/session.server";

// https://remix.run/api/conventions#meta
export let meta = () => {
  return {
    title: "Cure8",
    description:
      "Cureate content for you and your friends from anywhere on the web!",
  };
};

export let action = ({ request }: { request: Request }) => {
  return signOut(request);
};

export let loader = async ({ request }: { request: Request }) => {
  const sessionUser = await getUserSession(request);

  return sessionUser;
};

// https://remix.run/guides/routing#index-routes
export default function Index() {
  const data = useLoaderData();
  console.log("🚀 ~ file: index.tsx ~ line 28 ~ Index ~ data", data);

  return (
    <Container maxW={"5xl"}>
      <Stack
        textAlign={"center"}
        align={"center"}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 40, md: 28 }}
      >
        <Image
          alt="Cure8 Logo"
          borderRadius="2xl"
          src="LogoText@0.25x.png"
          width="250px"
        />
        <Heading lineHeight={1.1} color="gray.700" size="2xl">
          Social Content Curation
        </Heading>
        <Text>
          Curate web content for your friends, such as YouTube videos, blog
          posts and interesting articles. Save links for yourself to view later.
        </Text>
        <Text>
          Cure8 is an app that allows you to save links to anything on the
          internet for you or your friends to view later. See a video your
          friend would enjoy? Cure8 it for them! They'll be able to open the app
          and watch it when they're ready.
        </Text>

        <Button as={RemixLink} colorScheme="brand" to="/help">
          Learn More
        </Button>
        <Stack
          spacing={{ base: 4, sm: 6 }}
          direction={{ base: "column", sm: "row" }}
        >
          <a
            href="https://apps.apple.com/au/app/cure8/id1525122380"
            rel="noreferrer"
            target="_blank"
          >
            <Image
              alt="App Store Link"
              src="logo-app-store.png"
              width="180px"
            />
          </a>
        </Stack>
      </Stack>
    </Container>
  );
  // return (
  //   <div className="remix__page">
  //     <main>
  //       <h2>Welcome to Cure8</h2>

  //       {data && <Form method="post">
  //         <button type="submit">Sign Out</button>
  //       </Form>}
  //     </main>
  //   </div>
  // );
}
