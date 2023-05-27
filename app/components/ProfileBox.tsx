import { Avatar, HStack, Text, useColorModeValue } from '@chakra-ui/react'
import { Link } from '@remix-run/react'

type Props = {
  mame: string
  email?: string
  avatarUrl: string
  size?: 'sm' | 'lg'
}

export const ProfileBox = ({ name, avatarUrl, email, size = 'sm', borderTop }: Props) => {
  console.log({ name, avatarUrl, email })
  const color = useColorModeValue('gray.900', 'white')
  const borderColor = useColorModeValue('gray.100', 'gray.700')

  return (
    <HStack
      as={Link}
      cursor="pointer"
      paddingY="24px"
      paddingX="12px"
      borderTop={borderTop}
      borderColor={borderColor}
      to="/profile"
      spacing={size === 'lg' ? '12px' : '8px'}
    >
      <Avatar color={color} name={name} src={avatarUrl} size={size} />
      <div>
        <Text color={color} fontSize={size === 'lg' ? 'xl' : undefined}>
          {name}
        </Text>
        <Text fontSize={size} variant="faint">
          {email}
        </Text>
      </div>
    </HStack>
  )
}
