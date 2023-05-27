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
  useBoolean,
} from '@chakra-ui/react'
import { Link as RouterLink, useOutletContext, useNavigation } from '@remix-run/react'
import { json, redirect, type LoaderArgs } from '@remix-run/node'
import z from 'zod'
import { useState } from 'react'

import type { SupabaseOutletContext } from '~/root'
import { getSupabaseSession } from '~/api/auth.server'
import { PasswordInput } from '~/components'

const schema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
})

type FormattedErrors = z.inferFormattedError<typeof schema>

export const loader = async ({ request }: LoaderArgs) => {
  const { session } = await getSupabaseSession(request)
  if (session) {
    return redirect('/feed')
  }

  return json({})
}

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [errors, setErrors] = useState<FormattedErrors>()

  const [processing, setProcessing] = useBoolean()

  const navigation = useNavigation()
  const isLoading = processing || navigation.state !== 'idle'

  const { supabase } = useOutletContext<SupabaseOutletContext>()

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/feed',
      },
    })

    if (error) {
      throw new Error(error.message)
    }
  }

  const signUp = async () => {
    setProcessing.on()
    setErrors(undefined)

    try {
      const result = schema.safeParse({ email, password, name })
      if (!result.success) {
        setErrors(result.error.format())
        return
      }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      })

      if (error) {
        throw new Error(error.message)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    switch (name) {
      case 'email':
        setEmail(value)
        break
      case 'password':
        setPassword(value)
        break
      case 'name':
        setName(value)
        break
      default:
        break
    }
  }

  return (
    <Flex bg={useColorModeValue('gray.50', 'gray.800')} height="100%">
      <Stack spacing={8} mx={'auto'} maxW={'lg'} minW="md" py={12} px={6}>
        <Center mb="5">
          <Image alt="Cure8 Logo" borderRadius="2xl" src="LogoText@0.25x.png" width="250px" />
        </Center>
        <Stack align={'center'}>
          <Heading fontSize={'xl'}>Create your Cure8 account</Heading>
        </Stack>
        <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.700')} boxShadow={'lg'} p={8}>
          <Stack spacing={8}>
            <Stack spacing={4}>
              <FormControl id="email" isInvalid={!!errors?.email}>
                <FormLabel>Email address</FormLabel>
                <Input type="email" name="email" value={email} onChange={handleChange} />
                <FormErrorMessage>{errors?.email?._errors}</FormErrorMessage>
              </FormControl>
              <FormControl id="name" isInvalid={!!errors?.name}>
                <FormLabel>Full name</FormLabel>
                <Input name="name" value={name} onChange={handleChange} />
                <FormErrorMessage>{errors?.name?._errors}</FormErrorMessage>
              </FormControl>
              <FormControl id="password" isInvalid={!!errors?.password}>
                <FormLabel>Password</FormLabel>
                <PasswordInput name="password" value={password} onChange={handleChange} />
                <FormErrorMessage>{errors?.password?._errors}</FormErrorMessage>
              </FormControl>
            </Stack>

            <Button colorScheme="brand" onClick={signUp} type="button" {...{ isLoading }}>
              Create account
            </Button>

            <HStack spacing="24px">
              <Divider />
              <Text>or</Text>
              <Divider />
            </HStack>

            <Button variant="outline" onClick={signInWithGoogle} {...{ isLoading }}>
              <Image alt="Google logo" htmlHeight="20px" htmlWidth="20px" marginRight="12px" src="google-logo.svg" />
              <Text fontFamily="Roboto" fontSize="16px">
                Sign up with Google
              </Text>
            </Button>
          </Stack>
        </Box>
        <Text align="center">
          Already have an account?{' '}
          <Link as={RouterLink} to="/login">
            Login instead
          </Link>
          .
        </Text>
      </Stack>
    </Flex>
  )
}
