import { Button, Icon, type ButtonProps } from '@chakra-ui/react'
import { FiCheck, FiPlus } from 'react-icons/fi'

type Props = ButtonProps & {
  isSubscribed: boolean
}

export const SubscribeButton = ({ isSubscribed, size = 'xs', ...rest }: Props) => {
  if (isSubscribed) {
    return (
      <Button
        name="action"
        value="unsubscribe"
        size={size}
        type="submit"
        variant="outline"
        leftIcon={<Icon as={FiCheck} />}
        {...rest}
      >
        Subscribed
      </Button>
    )
  }

  return (
    <Button
      name="action"
      value="subscribe"
      colorScheme="brand"
      size={size}
      type="submit"
      leftIcon={<Icon as={FiPlus} />}
      {...rest}
    >
      Subscribe
    </Button>
  )
}
