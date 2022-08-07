import { Text, Stack, Heading } from "@chakra-ui/react";

export default function Contacts() {
  return (
    <Stack spacing={10}>
      <Stack maxWidth="650px" spacing={5}>
        <Heading size="lg" marginBottom="12px" textAlign="center">
          Contacts
        </Heading>
        <Text>
          To curate any content for your friends, you first need to add them as
          a contact in the app. You will need to know their email address for
          this.
        </Text>
        <Text>
          Contacts in Cure8 are not connections. You need to add your friends as
          a contact, and they can separately add you as one of their contacts.
          You can curate content for anyone without them having to add you back
          as a contact.
        </Text>
        <Text>
          When you add a friend as a contact in Cure8, you can curate content
          for them. If they haven't yet set up a Cure8 account, they are
          notified via email that you have curated something for them and that
          they need to sign up to the app to view it. They will receive no more
          than 3 of these emails before the emails stop.
        </Text>
        <Text>
          Once they have signed up for an account, any content already curated
          for them by you or others, using their email address, will be
          available on their links screen.
        </Text>
        <Text>
          To add a contact, navigate to the contacts screen (second last icon on
          the bottom nav bar) and press <Text as="b">Add New Contact</Text>. You
          will see a screen where you can type in an email address and a contact
          name, or you can tap <Text as="b">Select from phone contacts</Text> to
          import a contact from your phone's address book.
        </Text>
        <Text>
          You will need to give Cure8 permission to access your contacts. Cure8
          will not save any information from your contacts other than the email
          address you select. Scroll to find the name of the contact, tap on
          their name and then select the email address you want to use.
        </Text>
        <Text>
          You will know your contact has a Cure8 account already set up if you
          see a small green Cure8 logo next to their name. Again, you can still
          curate content for them even if they don't have an account, it will be
          held for them for when they do sign up.
        </Text>
      </Stack>
    </Stack>
  );
}
