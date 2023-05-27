import { Image } from "@chakra-ui/react";

import LogoImage from "./LogoText@0.1x.png";

export const Logo = ({ width }: { width: string }) => (
  <Image alt="Cure8 Logo" borderRadius="2xl" src={LogoImage} {...{ width }} />
);
