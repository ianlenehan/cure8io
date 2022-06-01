import { ReactNode } from "react";
import {
  Box,
  Container,
  Stack,
  Center,
  Text,
  Image,
  Link,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";

const ListHeader = ({ children }: { children: ReactNode }) => {
  return (
    <Text fontWeight={"500"} fontSize={"lg"} mb={2}>
      {children}
    </Text>
  );
};

export default function Footer() {
  return (
    <footer>
      <Box
        bg={useColorModeValue("gray.50", "gray.900")}
        borderTopWidth={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.700")}
        color={useColorModeValue("gray.700", "gray.200")}
        margin={20}
        position="fixed"
        bottom="0"
        left="0"
        right="0"
      >
        <Container maxW={"6xl"} py={10}>
          <Flex justifyContent="space-between">
            <Stack align={"flex-start"}>
              <a href="mailto:ian@cure8.io">Contact</a>
              <Link href="/privacy">Privacy Policy</Link>
            </Stack>
            <Stack align={"flex-start"}>
              <a
                href="https://apps.apple.com/au/app/cure8/id1525122380"
                rel="noreferrer"
                target="_blank"
              >
                <Image
                  alt="App Store Link"
                  src="logo-app-store.png"
                  width="120px"
                />
              </a>
            </Stack>
          </Flex>
        </Container>

        <Center>
          <Text>© 2022 Goleno Ltd. All rights reserved</Text>
        </Center>
      </Box>
    </footer>
  );
}
