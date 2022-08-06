import { ReactNode } from "react";
import {
  Box,
  Container,
  HStack,
  Center,
  Text,
  Image,
  Link,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import { Stack } from "@chakra-ui/react";

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
        backgroundColor="#fff"
        borderTopWidth={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.700")}
        padding={12}
        position="fixed"
        bottom="0"
        left="0"
        right="0"
        fontSize="12px"
      >
        <Center>
          <Stack>
            <HStack justify="center">
              <a href="mailto:ian@cure8.io">Contact</a>
              <Text> | </Text>
              <Link href="/privacy">Privacy Policy</Link>
            </HStack>
            <Text>© 2022 Goleno Ltd. All rights reserved.</Text>
          </Stack>
        </Center>
      </Box>
    </footer>
  );
}
