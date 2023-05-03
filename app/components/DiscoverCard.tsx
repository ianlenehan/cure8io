import { Form, Link as RouterLink } from '@remix-run/react'

import { Card, CardBody, HStack, Tag, Heading, Stack, Text, Link } from '@chakra-ui/react'

import type { List, ListTag, Subscription } from '~/types'
import { isSubscribed } from '~/utils/helpers'

import { SubscribeButton } from './SubscribeButton'

type Props = {
  list: List
  listTags?: ListTag | ListTag[]
  subscriptions: Subscription[]
  isSubmitting: boolean
}

export const DiscoverCard = ({ list, listTags, subscriptions, isSubmitting }: Props) => {
  return (
    <Card key={list.id}>
      <CardBody>
        <Stack spacing="8">
          <Stack alignItems="flex-start">
            <Heading as="h3" size="md">
              <Link as={RouterLink} to={`list/${list.id}`}>
                {list.name}{' '}
              </Link>
            </Heading>
            <Form method="post">
              <input type="hidden" name="listId" value={list.id} />
              <SubscribeButton isDisabled={isSubmitting} isSubscribed={isSubscribed(list.id, subscriptions)} />
            </Form>
          </Stack>
          <Stack>
            <Text color="gray.500">{list.description}</Text>
            {Array.isArray(listTags) && (
              <HStack spacing="2">
                {listTags.map(({ id, name }) => (
                  <Tag key={id} size="sm">
                    {name}
                  </Tag>
                ))}
              </HStack>
            )}
          </Stack>
        </Stack>
      </CardBody>
    </Card>
  )
}
