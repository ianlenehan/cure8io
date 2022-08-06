import { Outlet, Link as RemixLink, useLocation } from "@remix-run/react";
import {
  Box,
  CloseButton,
  Flex,
  useColorModeValue,
  Drawer,
  DrawerContent,
  useDisclosure,
  Link,
  BoxProps,
  Image,
  FlexProps,
} from "@chakra-ui/react";

interface LinkItemProps {
  name: string;
  path: string;
}
const LinkItems: Array<LinkItemProps> = [
  { name: "Getting Started", path: "/help" },
  { name: "Curating Links", path: "/help/links" },
  { name: "Contacts", path: "/help/contacts" },
];

export default function Help() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg="gray.100" paddingBottom="70px">
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
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
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <Box ml={{ base: 0, md: 60 }} p="4">
        <Outlet />
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const { pathname } = useLocation();

  return (
    <Box
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Link as={RemixLink} to="/">
          <Image
            alt="Cure8 Logo"
            borderRadius="xl"
            src="LogoText@0.25x.png"
            width="120px"
          />
        </Link>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map(({ name, path }) => (
        <NavItem key={name} isActive={path === pathname} {...{ name, path }} />
      ))}
    </Box>
  );
};

type NavItemProps = LinkItemProps &
  FlexProps & {
    isActive: boolean;
  };

const NavItem = ({ isActive, name, path, ...rest }: NavItemProps) => {
  return (
    <Flex margin="12px" {...rest}>
      <Link
        as={RemixLink}
        color={isActive ? "brand.900" : undefined}
        to={path}
        variant="dark"
      >
        {name}
      </Link>
    </Flex>
  );
};
