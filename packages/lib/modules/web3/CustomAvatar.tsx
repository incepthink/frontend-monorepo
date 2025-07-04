import { Image, ImageProps } from '@chakra-ui/react'
import { AvatarComponentProps } from '@rainbow-me/rainbowkit/dist/components/RainbowKitProvider/AvatarContext'

export function CustomAvatar({
  address,
  ensImage,
  size,
  alt,
  ...props
}: ImageProps & AvatarComponentProps) {
  const avatarUrl = ensImage ? ensImage : `/avatar.svg`

  return <Image alt={alt} height={size} src={avatarUrl} width={size} {...props} />
}
