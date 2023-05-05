import { Avatar, HStack, Text, useColorModeValue } from '@chakra-ui/react'
import { Link } from '@remix-run/react'

type Props = {
  userData: {
    full_name: string
    email: string
    avatar_url: string
  }
}

export const ProfileBox = ({ userData }: Props) => {
  const color = useColorModeValue('gray.900', 'white')
  const borderColor = useColorModeValue('gray.100', 'gray.700')

  return (
    <HStack as={Link} cursor="pointer" paddingY="24px" paddingX="12px" borderTop="1px" borderColor={borderColor}>
      <Avatar color={color} name={userData.full_name} src={userData.avatar_url} size="sm" />
      <div>
        <Text color={color}>{userData.full_name}</Text>
        <Text fontSize="sm" variant="faint">
          {userData.email}
        </Text>
      </div>
    </HStack>
  )
}
