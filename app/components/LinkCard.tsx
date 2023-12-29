import type { BoxProps } from '@chakra-ui/react'
import { Flex } from '@chakra-ui/react'
import { Box, Text, useColorModeValue } from '@chakra-ui/react'
import type { CuratedLink, Newsletter as NewsletterType, Issue as IssueType } from '~/types'
import { Link } from '@remix-run/react'
import { format } from 'date-fns'

type Newsletter = Pick<NewsletterType, 'name'>
type Issue = Pick<IssueType, 'issue_number' | 'date'>

type Props = BoxProps & {
  isClicked?: boolean
  link: CuratedLink & {
    newsletters: Newsletter | Newsletter[] | null
    issues: Issue | Issue[] | null
  }
}

export const LinkCard = ({ link, isClicked, ...rest }: Props) => {
  const { description, title, url, newsletters } = link
  const newsletterName = Array.isArray(newsletters) ? newsletters?.[0]?.name : newsletters?.name
  const issue = Array.isArray(link.issues) ? link.issues?.[0] : link.issues

  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.800')}
      borderWidth="1px"
      cursor="pointer"
      display="inline-block"
      maxWidth="40vw"
      opacity={isClicked ? 0.6 : 1}
      px="6"
      py="4"
      rounded="lg"
      transition="all .2s ease-in-out"
      width="100%"
      _hover={{
        transform: 'translateY(-2px)',
      }}
      {...rest}
    >
      <Link to={url} target="_blank">
        <Text fontSize="lg" fontWeight="bold">
          {title}
        </Text>
        <Text>{description}</Text>
      </Link>
      {newsletterName ? (
        <Flex justifyContent="space-between" gap={4} marginTop={4}>
          <Text align="right" fontSize="sm" color="gray.500">
            {newsletterName}
          </Text>
          {issue ? (
            <Text align="right" fontSize="sm" color="gray.500">
              {!!issue.issue_number && <Text as="span">#{issue.issue_number} - </Text>}
              {format(new Date(issue.date), 'd MMM yyy')}
            </Text>
          ) : null}
        </Flex>
      ) : null}
    </Box>
  )
}
