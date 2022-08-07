import { Text, Stack, Link, Heading } from "@chakra-ui/react";
import { Link as RemixLink } from "@remix-run/react";

export default function Links() {
  return (
    <Stack spacing={10}>
      <Stack maxWidth="650px" spacing={5}>
        <Heading size="lg" marginBottom="12px" textAlign="center">
          Curating Links
        </Heading>
        <Text>
          To curate content for more than just yourself, you're going to need to
          add some contacts. If you haven't done that yet,{" "}
          <Link as={RemixLink} to="/help/contacts">
            click here
          </Link>{" "}
          to learn about adding contacts.
        </Text>
        <Text>
          To add a new link, copy the URL of the link and in Cure8, tap the plus
          icon on the top left of your screen. You'll need to be on the links
          screen for this - it's the first icon on the left in the bottom nav
          bar.
        </Text>
        <Text>
          Tap the <Text as="b">Link URL</Text> input on the modal that comes up
          and paste in your URL.
        </Text>
        <Text>
          Next, you can add text to the comment field if you want to add a
          comment or some context. Your friends will see this when they open
          Cure8, but it's not required. There is also a{" "}
          <Text as="b">Save to my links</Text> checkbox which enables you to
          curate this link for yourself if you wish. Note that to save a link,
          you'll either need to save it to your links or select a contact.
        </Text>
        <Text>
          Tapping on <Text as="b">Select Contacts</Text> will open a screen with
          your Cure8 contacts and tapping on one will select them. Press{" "}
          <Text as="b">Done</Text> when you've selected all the contacts you
          want to curate this content for.
        </Text>
        <Text>
          Note that if the contact has a small green Cure8 logo next to their
          name, this means they have set up an account on the app.
        </Text>
        <Text>
          Once you've done this, and the app has finished fetching the metadata,
          you can press Save.
        </Text>
      </Stack>
    </Stack>
  );
}
