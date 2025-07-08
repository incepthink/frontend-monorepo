import { useDisclosure } from '@chakra-ui/hooks'
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'
import { ArrowUpRight, Menu } from 'react-feather'
import { AppLink, useNav } from './useNav'
import { SocialIcon } from './SocialIcon'

type NavLinkProps = {
  appLinks: AppLink[]
  customLinks?: React.ReactNode
  onClick?: () => void
}

type SocialLinkProps = {
  socialLinks: AppLink[]
}

type MobileNavProps = NavLinkProps & SocialLinkProps

function NavLinks({ appLinks, onClick, customLinks }: NavLinkProps) {
  const { linkColorFor } = useNav()

  return (
    <VStack align="start" w="full">
      {appLinks.map(link => (
        <Link
          alignItems="center"
          as={NextLink}
          color={linkColorFor(link.href)}
          display="flex"
          fontSize="xl"
          gap="xs"
          href={link.href}
          key={link.href}
          onClick={onClick}
          prefetch
          variant="nav"
        >
          {link.label}
          {link.isExternal && (
            <Box color="grayText">
              <ArrowUpRight size={14} />
            </Box>
          )}
        </Link>
      ))}
      {customLinks}
    </VStack>
  )
}

function SocialLinks({ socialLinks }: SocialLinkProps) {
  return (
    <HStack justify="space-between" w="full">
      {socialLinks.map(({ href, iconType }) => (
        <Button as={Link} href={href} isExternal key={href} variant="tertiary">
          <SocialIcon iconType={iconType} />
        </Button>
      ))}
    </HStack>
  )
}

export function MobileNav({ appLinks, customLinks }: MobileNavProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef(null)

  return (
    <>
      <div>
        <Button onClick={onOpen} ref={btnRef} variant="tertiary" sx={{ alignSelf: 'flex-end' }}>
          <Menu size={18} />
        </Button>
        <Drawer finalFocusRef={btnRef} isOpen={isOpen} onClose={onClose} placement="right">
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton color={'white'} />
            <DrawerHeader>
              <Text color={'white'} fontSize="lg" fontWeight="600">
                Menu
              </Text>
            </DrawerHeader>
            <DrawerBody>
              <NavLinks appLinks={appLinks} customLinks={customLinks} onClick={onClose} />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  )
}
