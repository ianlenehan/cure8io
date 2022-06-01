import {
  Flex,
  Center,
  Box,
  FormControl,
  FormLabel,
  Input,
  Image,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import { Form } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/node";

import { signIn } from "~/utils/db.server";
import { createUserSession } from "~/utils/session.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!(email && password)) {
    return null;
  }

  const { user } = await signIn(email, password);
  const token = await user.getIdToken();
  return createUserSession(token, "/links");
};

export default function Login() {
  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Center mb="5">
          <Image
            alt="Cure8 Logo"
            borderRadius="2xl"
            src="LogoText@0.25x.png"
            width="250px"
          />
        </Center>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Sign in to your account</Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <Form method="post">
              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input type="email" name="email" />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input type="password" name="password" />
              </FormControl>
              <Stack spacing={10}>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  align={"start"}
                  justify={"space-between"}
                >
                  <Checkbox>Remember me</Checkbox>
                  <Link color={"brand.500"}>Forgot password?</Link>
                </Stack>
                <Button colorScheme="brand" type="submit">
                  Sign in
                </Button>
              </Stack>
            </Form>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
