import { Link as RemixLink, useLocation } from "@remix-run/react";
import {
  Box,
  CloseButton,
  Flex,
  useColorModeValue,
  Link,
  BoxProps,
  Image,
} from "@chakra-ui/react";

type LinkItemProps = {
  name: string;
  path: string;
};

const LinkItems: Array<LinkItemProps> = [
  { name: "Getting Started", path: "/help" },
  { name: "Curating Links", path: "/help/links" },
  { name: "Archiving Links", path: "/help/archiving" },
  { name: "Contacts", path: "/help/contacts" },
  { name: "Media", path: "/help/media" },
];

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

export const Sidebar = ({ onClose, ...rest }: SidebarProps) => {
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
        <Flex
          key={name}
          onClick={onClose}
          margin={{ base: "32px", md: "18px" }}
          {...rest}
        >
          <Link
            as={RemixLink}
            fontSize={{ base: "28px", md: "18px" }}
            color={path === pathname ? "brand.900" : undefined}
            to={path}
            variant="dark"
          >
            {name}
          </Link>
        </Flex>
      ))}
    </Box>
  );
};
