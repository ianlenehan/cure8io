import { Flex, Box, Image, useColorModeValue } from "@chakra-ui/react";

export default function LinkCard(props) {
  const { id, curatorName, image, title, url, comment } = props;

  return (
    <Box
      bg={useColorModeValue("white", "gray.800")}
      borderWidth="1px"
      rounded="lg"
      shadow="lg"
      maxWidth="40vw"
    >
      <Image
        src={image}
        alt={`Picture of ${title}`}
        roundedTop="lg"
        fit="cover"
        width="100%"
      />

      <Box p="6">
        <Flex mt="1" justifyContent="space-between" alignContent="center">
          <Box
            fontSize="2xl"
            fontWeight="semibold"
            as="h4"
            lineHeight="tight"
            isTruncated
          >
            {title}
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}
