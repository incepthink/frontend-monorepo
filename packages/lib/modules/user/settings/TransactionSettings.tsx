'use client'
import {
  Button,
  HStack,
  Heading,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  VStack,
  Text,
  ButtonProps,
  useDisclosure,
  Box,
} from '@chakra-ui/react'
import { useUserSettings } from './UserSettingsProvider'
import { fNum } from '@repo/lib/shared/utils/numbers'
import { AlertTriangle, Settings } from 'react-feather'
import { CurrencySelect } from './CurrencySelect'
import { EnableSignaturesSelect, SlippageInput } from './UserSettings'
import { getDefaultProportionalSlippagePercentage } from '@repo/lib/shared/utils/slippage'
import { Pool } from '../../pool/pool.types'
import { EnableTxBundleSetting } from './EnableTxBundlesSetting'

export function TransactionSettings(props: ButtonProps) {
  const { slippage, setSlippage } = useUserSettings()

  return (
    <Popover isLazy placement="bottom-end">
      <PopoverTrigger>
        <Button variant="tertiary" {...props}>
          <HStack gap="6px" textColor="grayText">
            <Text color="grayText" fontSize="xs">
              {fNum('slippage', slippage)}
            </Text>
            <Settings size={14} />
          </HStack>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow bg="background.level3" />
        <PopoverCloseButton />
        <PopoverHeader>
          <Heading size="md">Transaction settings</Heading>
        </PopoverHeader>
        <PopoverBody p="md">
          <VStack align="start" spacing="lg" w="full">
            <VStack align="start" w="full">
              <Heading size="sm">Currency</Heading>
              <CurrencySelect id="transaction-settings-currency-select" />
            </VStack>
            <VStack align="start" w="full">
              <Heading size="sm">Slippage</Heading>
              <SlippageInput setSlippage={setSlippage} slippage={slippage} />
            </VStack>
            <Box w="full">
              <Heading pb="xs" size="sm">
                Use Signatures
              </Heading>
              <Text color="font.secondary" fontSize="sm" pb="sm">
                Signatures allow for gas-free transactions, where possible. If your wallet
                doesn&apos;t support signatures, you can turn it off.
              </Text>
              <EnableSignaturesSelect />
            </Box>
            <EnableTxBundleSetting />
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

interface ProportionalTransactionSettingsProps extends ButtonProps {
  slippage: string
  setSlippage: (value: string) => void
  pool: Pool
}

export function ProportionalTransactionSettings({
  slippage,
  setSlippage,
  pool,
  ...props
}: ProportionalTransactionSettingsProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const defaultProportionalSlippagePercentage = getDefaultProportionalSlippagePercentage(pool)

  return (
    <Popover isLazy isOpen={isOpen} onClose={onClose} placement="bottom-end">
      <PopoverTrigger>
        <Button onClick={onOpen} variant="tertiary" {...props}>
          <HStack textColor="grayText">
            <AlertTriangle size={16} />
            <Text color="grayText" fontSize="xs">
              {fNum('slippage', slippage)}
            </Text>
            <Settings size={16} />
          </HStack>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow bg="background.level3" />
        <PopoverCloseButton />
        <PopoverHeader>
          <Heading size="md">Transaction settings</Heading>
        </PopoverHeader>
        <PopoverBody p="md">
          <VStack align="start" spacing="lg" w="full">
            <VStack align="start" w="full">
              <Heading size="sm">Currency</Heading>
              <CurrencySelect id="transaction-settings-currency-select" />
            </VStack>
            <VStack align="start" w="full">
              <HStack>
                <Heading size="sm">Slippage</Heading>

                <Popover>
                  <PopoverTrigger>
                    <AlertTriangle size={16} />
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverBody>
                      <Text fontSize="sm" fontWeight="500" lineHeight="18px" variant="secondary">
                        Slippage is set to {defaultProportionalSlippagePercentage} by default for
                        forced proportional actions to reduce dust left over. If you need to set
                        slippage higher than {defaultProportionalSlippagePercentage} it will
                        effectively lower the amount of tokens you can add in the form below. Then,
                        if slippage occurs, the transaction can take the amount of tokens you
                        specified + slippage from your token balance.
                      </Text>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </HStack>
              <SlippageInput setSlippage={setSlippage} slippage={slippage} />
            </VStack>

            <Box w="full">
              <Heading pb="xs" size="sm">
                Use Signatures
              </Heading>
              <Text color="font.secondary" fontSize="sm" pb="sm">
                Signatures allow for gas-free transactions, where possible. If your wallet
                doesn&apos;t support signatures, you can turn it off.
              </Text>
              <EnableSignaturesSelect />
            </Box>
            <EnableTxBundleSetting />
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
