import { Link as RemixLink } from "@remix-run/react";
import {
  Box,
  Flex,
  useColorModeValue,
  Link,
  Image,
  FlexProps,
  IconButton,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";

type MobileProps = FlexProps & {
  onOpen: () => void;
};

export const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent="space-between"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<HamburgerIcon />}
      />

      <Link as={RemixLink} to="/">
        <Image
          alt="Cure8 Logo"
          borderRadius="xl"
          src="LogoText@0.25x.png"
          width="120px"
        />
      </Link>

      <Box width="40px" />
    </Flex>
  );
};
