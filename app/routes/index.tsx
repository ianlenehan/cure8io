import { Container, Stack, Text, Image, Button, Flex, ButtonGroup } from '@chakra-ui/react'
import { json, type LoaderArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Link } from 'react-router-dom'

import { getSupabaseSession } from '~/api/auth.server'

// https://remix.run/api/conventions#meta
export let meta = () => {
  return {
    title: 'Cure8',
    description: 'Cureate content for you and your friends from anywhere on the web!',
  }
}

export const loader = async ({ request }: LoaderArgs) => {
  const { session, response } = await getSupabaseSession(request)
  return json({ session }, { headers: response.headers })
}

// https://remix.run/guides/routing#index-routes
export default function Index() {
  const { session } = useLoaderData<typeof loader>()

  return (
    <Container maxW={'5xl'}>
      <Flex justifyContent={'flex-end'} mt={4}>
        {session ? null : (
          <ButtonGroup>
            <Button as={Link} to="login" size="sm" variant="ghost">
              Sign In
            </Button>
            <Button as={Link} colorScheme="brand" to="signup" size="sm">
              Sign Up
            </Button>
          </ButtonGroup>
        )}
      </Flex>
      <Stack textAlign={'center'} align={'center'} spacing={{ base: 8, md: 10 }} py={{ base: 40, md: 28 }}>
        <div>
          <Text fontSize="6xl" fontWeight="extrabold">
            Love{' '}
            <Text
              as="span"
              bgGradient="linear(to-r, brand.400, brand.700)"
              bgClip="text"
              fontSize="6xl"
              fontWeight="extrabold"
            >
              newsletters
            </Text>{' '}
            but
          </Text>
          <Text fontSize="6xl" fontWeight="extrabold">
            hate a{' '}
            <Text
              as="span"
              bgClip="text"
              bgGradient="linear(to-r, brand.400, brand.700)"
              fontWeight="extrabold"
              fontSize="6xl"
            >
              cluttered inbox
            </Text>
            ?
          </Text>
        </div>
        <Text fontSize="6xl" fontWeight="extrabold">
          Meet{' '}
          <Text
            as="span"
            bgClip="text"
            bgGradient="linear(to-r, brand.400, brand.700)"
            fontSize="6xl"
            fontWeight="extrabold"
          >
            Cure8
          </Text>
          .
        </Text>

        <div>
          <Text fontSize="1.3rem">Follow your favourite public lists. Or create your own.</Text>
          <Text fontSize="1.3rem">Save articles to read later. Share with friends.</Text>
        </div>

        <Image alt="Cure8 Logo" borderRadius="2xl" src="LogoText@0.25x.png" width="150px" />

        <Text fontSize="1.5rem" fontWeight="semibold">
          Coming soon.
        </Text>
      </Stack>
    </Container>
  )
}
