import { extendTheme, defineStyleConfig } from '@chakra-ui/react'
import type { ComponentStyleConfig } from '@chakra-ui/theme'

// https://themera.vercel.app/
const brandColor = {
  50: '#EBF9F1',
  100: '#C7EFD7',
  200: '#A4E5BE',
  300: '#80DBA4',
  400: '#5CD18A',
  500: '#38C771',
  600: '#2D9F5A',
  700: '#227744',
  800: '#174F2D',
  900: '#0B2817',
}

const styles = {
  global: {
    'html, body': {
      color: 'gray.700',
      fontKerning: 'normal',
      height: '100%',
      width: '100%',
      margin: '0',
      textRendering: 'optimizeLegibility',
    },
    '*': {
      WebkitTapHighlightColor: 'rgba(0,0,0,0)',
    },
  },
}

const Link: ComponentStyleConfig = defineStyleConfig({
  baseStyle: ({ colorMode }) => ({
    color: colorMode === 'dark' ? brandColor[400] : brandColor[600],
  }),
})

const Heading: ComponentStyleConfig = defineStyleConfig({
  baseStyle: ({ colorMode }) => ({
    fontFamily: "'OpenSans', sans-serif;",
    color: colorMode === 'dark' ? 'gray.200' : 'gray.700',
  }),
})

const Text: ComponentStyleConfig = {
  baseStyle: {
    fontFamily: "'Roboto', sans-serif;",
  },
  variants: {
    faint: ({ colorMode }) => ({
      color: colorMode === 'dark' ? 'gray.400' : 'gray.500',
    }),
  },
}

const theme = extendTheme({
  initialColorMode: 'light',
  colors: {
    brand: brandColor,
  },
  components: {
    Link,
    Text,
    Heading,
  },
  styles,
})

export default theme
