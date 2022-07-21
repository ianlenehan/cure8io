import { useLoaderData } from "@remix-run/react";
import { Container, Stack, Heading, Text, Image } from "@chakra-ui/react";

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
        py={{ base: 20, md: 28 }}
      >
        <Image
          alt="Cure8 Logo"
          borderRadius="2xl"
          src="LogoText@0.25x.png"
          width="250px"
        />
        <Heading
          lineHeight={1.1}
          fontWeight={600}
          fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
        >
          <Text as={"span"} position={"relative"}>
            Social Content Curation
          </Text>
        </Heading>
        <Text color={"gray.500"}>
          Curate web content for your friends, such as YouTube videos, blog
          posts and interesting articles. Save links for yourself to view later.
        </Text>
        <Text color={"gray.500"}>
          Cure8 is an app that allows you to save links to anything on the
          internet for you or your friends to view later. See a video your
          friend would enjoy? Cure8 it for them! They'll be able to open the app
          and watch it when they're ready.
        </Text>
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
      <iframe
        height="100%"
        sandbox="allow-forms allow-scripts"
        src={
          "https://23999.sandbox.ignitionapp.com/client-portal/6e5c199d8b269ab0edffd6a0c64525e865c1d338e4a0e6a321cea32945e1e891a63867a25a14d03fd4757204d8/proposal/prop_mlmuhpnkabzqacqa4o2a"
        }
        title="proposal"
        width="100%"
      />
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
