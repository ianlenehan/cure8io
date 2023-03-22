import { extendTheme } from "@chakra-ui/react";
import type { ComponentStyleConfig } from "@chakra-ui/theme";

const brandColor = {
  100: "#8ddfad",
  200: "#7ad9a0",
  300: "#67d492",
  400: "#54ce85",
  500: "#41c977",
  600: "#3bb56b",
  700: "#34a15f",
  800: "#3bb56b",
  900: "#34a15f",
};

const Link: ComponentStyleConfig = {
  variants: {
    dark: {
      color: "rgb(74, 85, 104)",
      fontWeight: "500",
      _hover: {
        color: brandColor[500],
        textDecoration: "none",
      },
    },
    brand: {
      color: brandColor[900],
    },
  },
  defaultProps: {
    variant: "brand",
  },
};

const Text: ComponentStyleConfig = {
  baseStyle: {
    color: "rgb(237, 242, 247)",
    fontFamily: "'OpenSans', sans-serif;",
    fontSize: "1.2rem",
  },
};

const Heading: ComponentStyleConfig = {
  baseStyle: {
    color: "rgb(237, 242, 247)",
    fontFamily: "'Montserrat', sans-serif;",
  },
};

const theme = extendTheme({
  colors: {
    brand: brandColor,
  },
  components: {
    Heading,
    Link,
    Text,
  },
});

export default theme;
