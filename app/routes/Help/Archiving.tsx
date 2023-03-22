import { Text, Stack, Heading } from "@chakra-ui/react";

export default function Archiving() {
  return (
    <Stack spacing={5}>
      <Heading size="lg" marginBottom="12px" textAlign="center">
        Archiving Links
      </Heading>
      <Text>
        Once you have some curated content on your Links page, you are able to
        either delete the link or archive it for future reference. There are
        three dots on the bottom right of each link which, when tapped, will
        open a contextual menu allowing you to share the link with a friend,
        archive it or delete it.
      </Text>
      <Text>
        When deleting or archiving a link that was shared with you by a friend,
        you are given the option to tap on an emoji reaction. Your friend will
        get notified that you reacted to their share.
      </Text>
      <Text>
        When archiving a link, you can add a tag to make it easy to filter your
        archived links in the future. Existing tags will show up for you to
        select when archiving. To create a new tag, type the tag name into the
        input and press <Text as="b">Create</Text>.
      </Text>
      <Text>
        Once you've added tags and a reaction, press the{" "}
        <Text as="b">Archive</Text> button to finish archiving your link.
      </Text>
      <Text>
        You can access archived links from the Archive tab, which will be the
        second icon in the bottom nav bar. The <Text as="b">Filter by Tag</Text>{" "}
        button at the top of that screen will open up a drawer of tags to filter
        your links by.
      </Text>
    </Stack>
  );
}
