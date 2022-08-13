import { Text, Stack, Heading } from "@chakra-ui/react";

export default function Media() {
  return (
    <Stack spacing={10}>
      <Stack maxWidth="650px" spacing={5}>
        <Heading size="lg" marginBottom="12px" textAlign="center">
          {"Movies & TV Shows"}
        </Heading>
        <Text>
          Cure8 has a Media tab, the middle icon on the bottom nav bar, which is
          where you can curate your own "Watchlist" for movies and shows you
          want to see, a "Currently Watching" list, and a "Watched" list for
          those you've finished.
        </Text>
        <Text>
          By pressing on the friends icon on the top right of the Media screen,
          you can see the shows and movies your friends are watching. Ecah of
          these has an <Text as="b">Add to watchlist</Text> button which will
          enable you to add them to your own watchlist.
        </Text>
        <Text>
          To add a new item to your own list, press the plus icon on the top
          left of the Media screen. Toggle between <Text as="b">Movie</Text> and{" "}
          <Text as="b">TV Show</Text> and start typing the name of the show or
          movie you are looking for. The list will update in real time. Note
          that the spelling must match, or the serch won't work.
        </Text>
        <Text>
          Once you can see the show or movie you want, tap on it to view more
          detail. It is in here you will select what list you want to add it to
          and if season data is available, you can select a season. Press{" "}
          <Text as="b">Save</Text>.
        </Text>
        <Text>
          To manage your lists, each Media item has a contextual menu, which
          you'll see as three dots below the title. This is where you can add a
          rating, move between your lists, curate the IMDB link for a friend, or
          delete the item.
        </Text>
      </Stack>
    </Stack>
  );
}
