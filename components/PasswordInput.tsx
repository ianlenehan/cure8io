import {
  useBoolean,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  type InputProps,
} from "@chakra-ui/react";

export const PasswordInput = (props: InputProps) => {
  const [isPasswordVisible, setPasswordVisibility] = useBoolean();

  return (
    <InputGroup>
      <Input type={isPasswordVisible ? "text" : "password"} {...props} />
      <InputRightElement width="4.5rem">
        <Button
          h="1.75rem"
          size="sm"
          type="button"
          onClick={setPasswordVisibility.toggle}
        >
          {isPasswordVisible ? "Hide" : "Show"}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
};
