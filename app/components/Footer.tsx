import { Box, HStack, Center, Text, Link } from "@chakra-ui/react";
import { Stack } from "@chakra-ui/react";

export default function Footer() {
  return (
    <footer>
      <Box padding="18px" fontSize="14px">
        <Center>
          <Stack>
            <HStack justify="center">
              <Link fontSize="1rem" href="mailto:ian@cure8.io">
                Contact
              </Link>
              <Text color="gray.500" fontSize="1rem">
                {" "}
                |{" "}
              </Text>
              <Link fontSize="1rem" href="/privacy">
                Privacy Policy
              </Link>
            </HStack>
            <Text color="gray.500" fontSize="1rem">
              © {new Date().getFullYear()} Goleno Ltd. All rights reserved.
            </Text>
          </Stack>
        </Center>
      </Box>
    </footer>
  );
}
