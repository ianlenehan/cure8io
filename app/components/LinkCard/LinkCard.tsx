import type { BoxProps } from '@chakra-ui/react'
import { Button, Center, useBoolean } from '@chakra-ui/react'
import { Flex } from '@chakra-ui/react'
import { Box, Text, useColorModeValue, Link, SlideFade } from '@chakra-ui/react'
import type { CuratedLink, Newsletter, Issue } from '~/types'
import { format } from 'date-fns'
import { FiXCircle } from 'react-icons/fi'

import { IssueNumber } from './Elements'

type Props = BoxProps & {
  isClicked?: boolean
  isDeleting: boolean
  isPruning?: boolean
  onPrune(): void
  link: CuratedLink & {
    newsletters: Newsletter | Newsletter[] | null
    issues: Issue | Issue[] | null
  }
}

export const LinkCard = ({ link, isClicked, isDeleting, isPruning, onClick, onPrune, ...rest }: Props) => {
  const { description, title, url, newsletters } = link
  const newsletterName = Array.isArray(newsletters) ? newsletters?.[0]?.name : newsletters?.name
  const issue = Array.isArray(link.issues) ? link.issues?.[0] : link.issues

  const [isHovering, setHover] = useBoolean()

  const bgColor = useColorModeValue('gray.50', 'gray.800')

  if (isDeleting) {
    return null
  }

  return (
    <Box
      _hover={{ shadow: 'md' }}
      bgColor={bgColor}
      borderWidth="1px"
      display="inline-block"
      maxWidth="40vw"
      onMouseEnter={setHover.on}
      onMouseLeave={setHover.off}
      position="relative"
      px="6"
      py="4"
      rounded="lg"
      transition="all .2s ease-in-out"
      width="100%"
      {...rest}
    >
      <Box opacity={isClicked ? 0.6 : 1}>
        <Link href={isPruning ? '#' : url} target="_blank">
          <Text fontSize="lg" fontWeight="bold" onClick={isPruning ? undefined : onClick}>
            {title}
          </Text>
        </Link>
        <Text>{description}</Text>
      </Box>
      {newsletterName ? (
        <Flex justifyContent="space-between" gap={4} marginTop={4}>
          <Text align="right" fontSize="sm" color="gray.500">
            {newsletterName}
          </Text>
          {issue ? (
            <Text align="right" fontSize="sm" color="gray.500">
              {!!issue.issue_number && <IssueNumber issue={issue} />}
              {format(new Date(issue.date), 'd MMM yyy')}
            </Text>
          ) : null}
        </Flex>
      ) : null}

      {isPruning && (
        <SlideFade
          in={isHovering}
          offsetY="20px"
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '100%' }}
        >
          <Center
            height="100%"
            _before={{
              bgGradient: 'linear(to-b, gray.50, gray.200)',
              content: '""' /* Create a pseudo-element */,
              position: 'absolute' /* Position the pseudo-element absolutely */,
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: '0.6',
            }}
          >
            <Button colorScheme="red" onClick={onPrune} size="sm" rightIcon={<FiXCircle />} zIndex={1}>
              Remove
            </Button>
          </Center>
        </SlideFade>
      )}
    </Box>
  )
}
