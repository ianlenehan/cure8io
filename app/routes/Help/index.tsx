import { Text, Stack, Link, Heading } from "@chakra-ui/react";
import { Link as RemixLink } from "@remix-run/react";

export default function HelpIndex() {
  return (
    <Stack spacing={10}>
      <Stack spacing={5}>
        <Heading size="lg" marginBottom="12px" textAlign="center">
          Hello!
        </Heading>
        <Text as="i">
          Ian here, the developer of Cure8. First of all, thank you for
          downloading my app! This has been a fun side project of mine since I
          learned to code several years ago, and I've finally taken the steps to
          take it seriously and make it available for everyone to use.
        </Text>
        <Text as="i">
          It's just me working on the app, so if you have any feedback or bugs
          to report, I'd love to hear from you!
        </Text>
      </Stack>
      <Stack spacing={5}>
        <Heading size="lg" marginBottom="12px" textAlign="center">
          How it works
        </Heading>
        <Text>
          Cure8 is designed to be a social content sharing app. Usually when we
          find some content we want to share with our friends, family or
          co-workers, we copy the link and send it to them on something like
          WhatsApp, Slack or email. How many times have you thought,{" "}
          <Text as="i">
            "I don't have time to watch this or read that right now, I'll come
            back to it later"
          </Text>
          , but never get around to coming back to it? Especially if there's a
          conversation going on, the link just gets lost.
        </Text>
        <Text>
          With Cure8, you can grab that link and curate it for your friends, by
          saving it to their links in the app. They'll be notified about it and
          when they have some down time, they can go into Cure8 and view the
          content you and others have curated for them. Think blog posts, news
          articles, YouTube videos, funny Tweets, anything from the web.{" "}
          <Link as={RemixLink} to="/help/links">
            Click here
          </Link>{" "}
          to read about saving links and curating content.
        </Text>
        <Text>
          By the way, you can curate content for anyone even if they haven't
          signed up yet.{" "}
          <Link as={RemixLink} to="/help/contacts">
            Visit this link
          </Link>{" "}
          to learn about how contacts in Cure8 work. It not's the same as making
          a connection on Facebook or LinkedIn, for example.
        </Text>
        <Text>
          Cure8 isn't just about social sharing. You can use it to save content
          for yourself to read later too. You can also archive content and add
          tags if you want to be able to refer back to it. I use it to save
          recipes I like, for example. Learn more about{" "}
          <Link as={RemixLink} to="/help/archiving">
            archiving content here
          </Link>
          .
        </Text>
        <Text>
          The app also has a handy{" "}
          <Link as={RemixLink} to="/help/media">
            media feature
          </Link>{" "}
          where you can add TV Shows and Movies that you want to watch, are
          watching and have watched. If you need inspiration on what to watch
          next, one tap shows you the shows and movies your friends are watching
          and if they enjoyed them or not!
        </Text>
      </Stack>
    </Stack>
  );
}
