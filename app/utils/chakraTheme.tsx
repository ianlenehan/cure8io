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

const styles = {
  global: {
    "html, body": {
      color: "gray.600",
      fontKerning: "normal",
      fontFamily: "'Roboto', sans-serif;",
      height: "100%",
      width: "100%",
      margin: "0",
      textRendering: "optimizeLegibility",
    },
    "*": {
      WebkitTapHighlightColor: "rgba(0,0,0,0)",
    },
  },
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

const Heading: ComponentStyleConfig = {
  baseStyle: {
    fontFamily: "'OpenSans', sans-serif;",
    color: "gray.700",
  },
};

const Text: ComponentStyleConfig = {
  baseStyle: {
    fontFamily: "'Roboto', sans-serif;",
  },
};

const theme = extendTheme({
  colors: {
    brand: brandColor,
  },
  components: {
    Link,
    Text,
    Heading,
  },
  styles,
});

export default theme;
