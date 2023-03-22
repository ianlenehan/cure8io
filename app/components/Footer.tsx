import { Box, HStack, Center, Text, Link } from "@chakra-ui/react";
import { Stack } from "@chakra-ui/react";

export default function Footer() {
  return (
    <footer>
      <Box
        bgColor="gray.900"
        borderTopWidth={1}
        borderStyle={"solid"}
        borderColor="gray.700"
        padding="18px"
        position="fixed"
        bottom="0"
        left="0"
        right="0"
        fontSize="14px"
      >
        <Center>
          <Stack>
            <HStack justify="center">
              <Text
                as="a"
                color="gray.300"
                fontSize="1rem"
                href="mailto:ian@cure8.io"
              >
                Contact
              </Text>
              <Text color="gray.100" fontSize="1rem">
                {" "}
                |{" "}
              </Text>
              <Text as={Link} color="gray.300" fontSize="1rem" href="/privacy">
                Privacy Policy
              </Text>
            </HStack>
            <Text color="gray.100" fontSize="1rem">
              © {new Date().getFullYear()} Goleno Ltd. All rights reserved.
            </Text>
          </Stack>
        </Center>
      </Box>
    </footer>
  );
}
