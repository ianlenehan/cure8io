import type { ReactNode } from 'react'
import type { BoxProps, FlexProps } from '@chakra-ui/react'
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  useDisclosure,
} from '@chakra-ui/react'
import { FiHome, FiLayers, FiMenu, FiCompass } from 'react-icons/fi'
import type { IconType } from 'react-icons'
import { useMatches, Link as RouterLink } from '@remix-run/react'

import { ProfileBox } from './ProfileBox'
import { Logo } from './Logo'

type LinkItemProps = {
  name: string
  icon: IconType
  to: 'feed' | 'lists' | 'discover'
}

const LinkItems: Array<LinkItemProps> = [
  { name: 'Feed', icon: FiHome, to: 'feed' },
  { name: 'My lists', icon: FiLayers, to: 'lists' },
  { name: 'Discover', icon: FiCompass, to: 'discover' },
]

type NavItemProps = FlexProps & {
  icon: IconType
  children: ReactNode
  to: LinkItemProps['to']
}

const NavItem = ({ icon, children, to, ...rest }: NavItemProps) => {
  const color = useColorModeValue('white', 'gray.900')

  return (
    <Link as={RouterLink} to={to} style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: useColorModeValue('brand.500', 'brand.500'),
          color,
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color,
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  )
}

type SidebarProps = BoxProps & {
  onClose: () => void
  currentUser: any
}

const SidebarContent = ({ onClose, currentUser, ...rest }: SidebarProps) => {
  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      flexDir="column"
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Logo width="150px" />
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      <Box flex={1}>
        {LinkItems.map((link) => (
          <NavItem key={link.name} icon={link.icon} to={link.to}>
            {link.name}
          </NavItem>
        ))}
      </Box>
      <ProfileBox
        avatarUrl={currentUser.user_metadata.avatar_url}
        name={currentUser.user_metadata.full_name}
        email={currentUser.email}
        borderTop="1px"
      />
    </Box>
  )
}

type SideNavProps = {
  children: ReactNode
  currentUser: any
}

export const SideNav = ({ children, currentUser }: SideNavProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const matches = useMatches()
  const hideNavSteps = matches.some((match) =>
    ['routes/signin', 'routes/signup', 'routes/login', 'routes/index'].includes(match.id)
  )

  const background = useColorModeValue('gray.50', 'gray.900')

  if (hideNavSteps) return <>{children}</>

  return (
    <Flex flexDir="column" minH="100vh" bg={background}>
      <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'flex' }} {...{ currentUser }} />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} {...{ currentUser }} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4" height="100%">
        {children}
      </Box>
    </Flex>
  )
}

type MobileProps = FlexProps & {
  onOpen: () => void
}

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton variant="outline" onClick={onOpen} aria-label="open menu" icon={<FiMenu />} />

      <Logo width="100px" />
    </Flex>
  )
}
