import { Box, Heading, Text } from '@chakra-ui/react'
import { WarningTwoIcon } from '@chakra-ui/icons'

type Props = {
  children: React.ReactNode
  title: string
  subtitle: string
}

export const ZeroState = ({ children, title, subtitle }: Props) => (
  <Box textAlign="center" py={10} px={6}>
    <WarningTwoIcon boxSize={'50px'} color={'yellow.500'} />
    <Heading as="h3" size="lg" mt={6} mb={2}>
      {/* You have no lists. */}
      {title}
    </Heading>
    <Text color={'gray.500'}>
      {/* It looks as if you haven't created any lists yet. Click the button below
        to get started. */}
      {subtitle}
    </Text>
    {children}
  </Box>
)
