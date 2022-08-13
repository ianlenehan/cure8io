import { Outlet } from "@remix-run/react";
import {
  Box,
  Flex,
  Drawer,
  DrawerContent,
  useDisclosure,
} from "@chakra-ui/react";

import { Sidebar } from "~/components/Help/Sidebar";
import { MobileNav } from "~/components/Help/MobileNav";

export default function Help() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg="gray.100" paddingBottom="70px">
      <Sidebar {...{ onClose }} display={{ base: "none", md: "block" }} />
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
          <Sidebar {...{ onClose }} />
        </DrawerContent>
      </Drawer>
      <MobileNav display={{ base: "flex", md: "none" }} {...{ onOpen }} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        <Flex
          alignItems="center"
          flexDirection="column"
          minH="100%"
          marginTop="32px"
        >
          <Outlet />
        </Flex>
      </Box>
    </Box>
  );
}
