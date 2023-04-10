import {
  Flex,
  Center,
  Box,
  FormControl,
  FormLabel,
  Input,
  Image,
  Stack,
  Link,
  Button,
  Heading,
  useColorModeValue,
  Text,
  HStack,
  Divider,
} from "@chakra-ui/react";
import { Form, Link as RouterLink, useOutletContext } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/node";

import type { SupabaseOutletContext } from "~/root";
import createServerSupabase from "~/utils/supabase.server";
import { PasswordInput } from "components/PasswordInput";

// export const action: ActionFunction = async ({ request }) => {
//   const formData = await request.formData();
//   const email = formData.get("email") as string;
//   const password = formData.get("password") as string;

//   if (!(email && password)) {
//     return null;
//   }

//   const response = new Response();
//   const supabase = createServerSupabase({ request, response });
//   const { data } = await supabase.from("meals").select();
//   return json({ meals: data || [] }, { headers: response.headers });

//   const { data, error } = await supabase.auth.signUp({
//     email: 'example@email.com',
//     password: 'example-password',
//   })

//   return null;

//   // const { user } = await signIn(email, password);
//   // const token = await user.getIdToken();
//   // return createUserSession(token, "/links");
// };

export default function Login() {
  const { supabase } = useOutletContext<SupabaseOutletContext>();

  // async function signInWithGoogle() {
  //   const res = await supabase.auth.signInWithOAuth({
  //     provider: "google",
  //   });
  //   console.log("🚀 ~ file: login.tsx:6 ~ signInWithGoogle ~ error:", res);
  // }

  return (
    <Flex bg={useColorModeValue("gray.50", "gray.800")} height="100%">
      <Stack spacing={8} mx={"auto"} maxW={"lg"} minW="md" py={12} px={6}>
        <Center mb="5">
          <Image
            alt="Cure8 Logo"
            borderRadius="2xl"
            src="LogoText@0.25x.png"
            width="250px"
          />
        </Center>
        <Stack align={"center"}>
          <Heading fontSize={"xl"}>Sign in to your account</Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Form method="post">
            <Stack spacing={4}>
              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input type="email" name="email" />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <PasswordInput />
              </FormControl>
            </Stack>
            <Stack spacing={10}>
              <Link color={"brand.500"}>Forgot password?</Link>

              <Button colorScheme="brand" type="submit">
                Sign in
              </Button>

              <HStack spacing="24px">
                <Divider />
                <Text>or</Text>
                <Divider />
              </HStack>

              <Button type="submit" variant="outline">
                <Image
                  alt="Google logo"
                  htmlHeight="20px"
                  htmlWidth="20px"
                  marginRight="12px"
                  src="google-logo.svg"
                />
                <Text fontFamily="Roboto" fontSize="16px">
                  Sign in with Google
                </Text>
              </Button>
            </Stack>
          </Form>
        </Box>
        <Text align="center">
          First time here?{" "}
          <Link as={RouterLink} to="/signup">
            Create an account
          </Link>
          .
        </Text>
      </Stack>
    </Flex>
  );
}
