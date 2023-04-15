import {
  Flex,
  Center,
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
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
  useBoolean,
} from "@chakra-ui/react";
import {
  Link as RouterLink,
  useOutletContext,
  useNavigation,
} from "@remix-run/react";
import { json, redirect, type LoaderArgs } from "@remix-run/node";
import { useState } from "react";
import z from "zod";

import type { SupabaseOutletContext } from "~/root";
import createServerSupabase from "~/utils/supabase.server";
import { PasswordInput } from "~/components/PasswordInput";

export const loader = async ({ request }: LoaderArgs) => {
  const response = new Response();
  const supabase = createServerSupabase({ request, response });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    return redirect("/feed");
  }

  return json({});
};

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type FormattedErrors = z.inferFormattedError<typeof schema>;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormattedErrors>();

  const [processing, setProcessing] = useBoolean();

  const navigation = useNavigation();
  const isLoading = processing || navigation.state !== "idle";

  const { supabase } = useOutletContext<SupabaseOutletContext>();

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/feed",
      },
    });

    if (error) {
      throw error;
    }
  };

  const signIn = async () => {
    setProcessing.on();

    try {
      const result = schema.safeParse({ email, password });
      if (!result.success) {
        setErrors(result.error.format());
        return;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    switch (name) {
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }
  };

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
          <Stack spacing={8}>
            <Stack spacing={4}>
              <FormControl id="email" isInvalid={!!errors?.email}>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                />
                <FormErrorMessage>{errors?.email?._errors}</FormErrorMessage>
              </FormControl>
              <FormControl id="password" isInvalid={!!errors?.password}>
                <FormLabel>Password</FormLabel>
                <PasswordInput
                  name="password"
                  value={password}
                  onChange={handleChange}
                />
                <FormErrorMessage>{errors?.password?._errors}</FormErrorMessage>
              </FormControl>
            </Stack>

            <Button
              colorScheme="brand"
              onClick={signIn}
              type="button"
              {...{ isLoading }}
            >
              Sign in
            </Button>

            <HStack spacing="24px">
              <Divider />
              <Text>or</Text>
              <Divider />
            </HStack>

            <Button
              variant="outline"
              onClick={signInWithGoogle}
              {...{ isLoading }}
            >
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
          {/* <Form method="post">
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
                <Text
                  fontFamily="Roboto"
                  fontSize="16px"
                  onClick={signInWithGoogle}
                >
                  Sign in with Google
                </Text>
              </Button>
            </Stack>
          </Form> */}
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
