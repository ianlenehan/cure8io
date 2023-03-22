import { useLoaderData } from "@remix-run/react";
import { Link as RemixLink } from "@remix-run/react";
import {
  Container,
  Stack,
  Heading,
  Text,
  Image,
  Button,
  HStack,
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
        <div>
          <Text color="#fff" fontSize="6xl" fontWeight="extrabold">
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
          <Text color="#fff" fontSize="6xl" fontWeight="extrabold">
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
        <Text color="#fff" fontSize="6xl" fontWeight="extrabold">
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
          <Text color="gray.100" fontSize="1.3rem">
            Follow your favourite public lists. Or create your own.
          </Text>
          <Text color="gray.100" fontSize="1.3rem">
            Save articles to read later. Share with friends.
          </Text>
        </div>

        <Image
          alt="Cure8 Logo"
          borderRadius="2xl"
          src="LogoText@0.25x.png"
          width="150px"
        />

        <Text color="gray.100" fontSize="1.5rem" fontWeight="semibold">
          Coming soon.
        </Text>

        {/* <Button as={RemixLink} colorScheme="brand" to="/help">
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
        </Stack> */}
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
