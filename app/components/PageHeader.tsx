import { Flex, Heading, Stack, Divider } from "@chakra-ui/react";

type Props = {
  title: string;
  children?: React.ReactNode;
};

export const PageHeader = ({ title, children }: Props) => (
  <Stack spacing="2" marginBottom="6">
    <Flex justifyContent="space-between">
      <Heading size="lg" marginBottom="3">
        {title}
      </Heading>
      {children}
    </Flex>
    <Divider />
  </Stack>
);
