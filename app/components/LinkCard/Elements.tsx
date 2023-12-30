import { Link, Text } from '@chakra-ui/react'

import type { Issue } from '~/types'

export const IssueNumber = ({ issue }: { issue: Issue }) => {
  if (issue.web_link) {
    return (
      <Text as="span">
        <Link href={issue.web_link} target="_blank">
          #{issue.issue_number}
        </Link>{' '}
        -{' '}
      </Text>
    )
  }

  return <Text as="span">#{issue.issue_number} - </Text>
}
