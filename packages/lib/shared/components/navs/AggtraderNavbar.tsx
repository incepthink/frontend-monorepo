'use client'

import { ConnectWallet } from '@repo/lib/modules/web3/ConnectWallet'
import React, { useState } from 'react'
import {
  Box,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
  useBreakpointValue,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  Text,
  Image,
  Link,
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'

interface NavLinkProps {
  href: string
  children: React.ReactNode
  isActive?: boolean
  isMobile?: boolean
  onClick?: () => void
}

function NavLink({ href, children, isActive, isMobile, onClick }: NavLinkProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link
      href={href}
      onClick={onClick}
      position="relative"
      p={isMobile ? '12px 0' : '4px 8px'}
      fontSize={isMobile ? '1.1rem' : '1.25rem'}
      textDecoration="none"
      color={href === '#' ? '#00ffe9' : 'white'}
      transition="color 0.2s"
      display="block"
      width="100%"
      _hover={{ textDecoration: 'none' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        color: isHovered ? '#00ffe9' : href === '#' ? '#00ffe9' : 'white',
      }}
    >
      {children}
      <Box
        position="absolute"
        bottom={0}
        left={0}
        height={isActive ? '2px' : '0'}
        width="100%"
        background="linear-gradient(to right, #00FFE9, #003B3C)"
        transition="height 0.2s"
        display="block"
      />
    </Link>
  )
}

const navItems = [
  { href: 'https://aggtrade.xyz/spot', label: 'Spot' },
  { href: 'https://perp.aggtrade.xyz/', label: 'Perps' },
  { href: 'https://lending.aggtrade.xyz/', label: 'Lend/Borrow' },
  { href: '#', label: 'Yield Farming' },
  { href: 'https://aggtrade.xyz/profile', label: 'Account' },
]

export default function AggtraderNavbar() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const isMobile = useBreakpointValue({ base: true, lg: false })
  const pathname = typeof window !== 'undefined' ? window.location.pathname : ''

  return (
    <Box
      as="nav"
      position="sticky"
      top={0}
      bg="rgb(5, 14, 25)"
      boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
      zIndex={1000}
    >
      <Flex
        justify="space-between"
        align="center"
        px={{ base: '16px', lg: '40px' }}
        py={{ base: '8px', lg: '16px' }}
        minH={{ base: '64px', lg: '80px' }}
      >
        {/* Logo */}
        <Link
          href="https://aggtrade.xyz/"
          display="flex"
          alignItems="center"
          gap="10px"
          textDecoration="none"
          _hover={{ textDecoration: 'none' }}
        >
          <Box w={{ base: '32px', lg: '40px' }}>
            <Image src="/Aggtrade-logo.svg" alt="" w="100%" objectFit="cover" />
          </Box>
          <Text
            as="h2"
            fontWeight={600}
            color="white"
            cursor="pointer"
            fontSize={{ base: '1.25rem', lg: '1.5rem' }}
            m={0}
          >
            AggTrade
          </Text>
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <HStack spacing="24px" as="ul" listStyleType="none" m={0} p={0}>
            {navItems.map(({ href, label }) => {
              const isInternal = href.startsWith('/')
              const isActive = isInternal && (pathname === href || pathname.startsWith(href))

              return (
                <Box as="li" key={href} m={0}>
                  <NavLink href={href} isActive={isActive}>
                    {label}
                  </NavLink>
                </Box>
              )
            })}
          </HStack>
        )}

        {/* Desktop Connect Button */}
        {!isMobile && <ConnectWallet />}

        {/* Mobile Menu */}
        {isMobile && (
          <Flex align="center" gap={2}>
            <ConnectWallet />
            <IconButton
              aria-label="menu"
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              variant="ghost"
              color="white"
              _hover={{
                bg: 'rgba(255, 255, 255, 0.1)',
              }}
              onClick={isOpen ? onClose : onOpen}
            />
          </Flex>
        )}
      </Flex>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="rgb(5, 14, 25)" color="white" maxW="280px">
          <DrawerHeader
            borderBottomWidth="1px"
            borderBottomColor="rgba(255, 255, 255, 0.1)"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text as="h3" color="white" fontWeight={600} fontSize="1.25rem" m={0}>
              Menu
            </Text>
            <DrawerCloseButton
              position="relative"
              top="auto"
              right="auto"
              color="white"
              _hover={{
                bg: 'rgba(255, 255, 255, 0.1)',
              }}
            />
          </DrawerHeader>

          <DrawerBody p={0}>
            <VStack spacing={0} align="stretch">
              {navItems.map(({ href, label }) => {
                const isInternal = href.startsWith('/')
                const isActive = isInternal && (pathname === href || pathname.startsWith(href))

                return (
                  <Box
                    key={href}
                    _hover={{
                      bg: 'rgba(0, 255, 233, 0.1)',
                    }}
                  >
                    <NavLink href={href} isActive={isActive} isMobile={true} onClick={onClose}>
                      {label}
                    </NavLink>
                  </Box>
                )
              })}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  )
}
