import {
  Flex,
  Center,
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Image,
  Link,
  Stack,
  Button,
  Heading,
  useColorModeValue,
  Text,
  HStack,
  Divider,
} from "@chakra-ui/react";
import { Link as RouterLink, useOutletContext } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/node";
import z from "zod";
import type { ZodError } from "zod";
import { useState, useMemo } from "react";

import type { SupabaseOutletContext } from "~/root";
import { PasswordInput } from "components/PasswordInput";
import { signIn } from "~/utils/db.server";
import { createUserSession } from "~/utils/session.server";

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

type FormattedErrors = z.inferFormattedError<typeof schema>;

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [errors, setErrors] = useState<FormattedErrors>();
  console.log("🚀 ~ file: signup.tsx:73 ~ Signup ~ errors:", errors);

  const { supabase } = useOutletContext<SupabaseOutletContext>();

  async function signInWithGoogle() {
    const res = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    console.log("🚀 ~ file: login.tsx:6 ~ signInWithGoogle ~ error:", res);
  }

  const signUp = async () => {
    setErrors(undefined);
    console.log({ email, password, name });
    try {
      console.log("result 1");
      const result = schema.safeParse({ email, password, name });
      if (!result.success) {
        console.log("result?");
        setErrors(result.error.format());
        return;
      }
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw Error;
      }
    } catch (err) {
      console.error(err);
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
      case "name":
        setName(value);
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
          <Heading fontSize={"xl"}>Create your Cure8 account</Heading>
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
              <FormControl id="name" isInvalid={!!errors?.name}>
                <FormLabel>Full name</FormLabel>
                <Input name="name" value={name} onChange={handleChange} />
                <FormErrorMessage>{errors?.name?._errors}</FormErrorMessage>
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

            <Button colorScheme="brand" onClick={signUp} type="button">
              Create account
            </Button>

            <HStack spacing="24px">
              <Divider />
              <Text>or</Text>
              <Divider />
            </HStack>

            <Button variant="outline" onClick={signInWithGoogle}>
              <Image
                alt="Google logo"
                htmlHeight="20px"
                htmlWidth="20px"
                marginRight="12px"
                src="google-logo.svg"
              />
              <Text fontFamily="Roboto" fontSize="16px">
                Sign up with Google
              </Text>
            </Button>
          </Stack>
        </Box>
        <Text align="center">
          Already have an account?{" "}
          <Link as={RouterLink} to="/login">
            Login instead
          </Link>
          .
        </Text>
      </Stack>
    </Flex>
  );
}
