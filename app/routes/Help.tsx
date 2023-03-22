import { Outlet } from "@remix-run/react";
import {
  Box,
  Center,
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
    <Center>
      <Box minH="100vh" paddingBottom="70px" maxWidth="800px">
        <Sidebar display={{ base: "none", md: "block" }} />
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
    </Center>
  );
}
