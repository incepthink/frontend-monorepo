import { Badge, BadgeProps, Box, Heading, HStack, Text, Wrap } from '@chakra-ui/react'
import {
  GqlChain,
  GqlPoolTokenDetail,
  GqlPoolType,
} from '@repo/lib/shared/services/api/generated/graphql'
import { fNum } from '@repo/lib/shared/utils/numbers'
import { TokenIcon } from '../../tokens/TokenIcon'
import { TokenIconStack } from '../../tokens/TokenIconStack'
import { usePoolMetadata } from '../metadata/usePoolMetadata'
import { isStableLike, isWeightedLike } from '../pool.helpers'
import { getUserReferenceTokens } from '../pool-tokens.utils'
import { PoolCore, PoolToken } from '../pool.types'
import { VotingPoolWithData } from '../../vebal/vote/vote.types'
import { ApiToken } from '@repo/lib/modules/tokens/token.types'
import { voteToPool } from '@repo/lib/modules/vebal/vote/vote.helpers'

function NestedTokenPill({
  nestedTokens,
  chain,
  iconSize = 24,
}: {
  nestedTokens: GqlPoolTokenDetail[]
  chain: GqlChain
  iconSize?: number
}) {
  const isFirstToken = (index: number) => index === 0

  return nestedTokens.map((nestedToken, i) => {
    const nestedZIndices = Array.from(
      { length: nestedTokens?.length || 0 },
      (_, index) => index + 1
    ).reverse()

    const token = nestedToken.underlyingToken ?? nestedToken

    return (
      token && (
        <Box key={token.address} ml={isFirstToken(i) ? 0 : -3} zIndex={nestedZIndices[i]}>
          <TokenIcon address={token.address} alt={token.symbol} chain={chain} size={iconSize} />
        </Box>
      )
    )
  })
}

function WeightedTokenPills({
  tokens,
  chain,
  iconSize = 24,
  nameSize,
  ...badgeProps
}: {
  tokens: (PoolToken | ApiToken)[]
  chain: GqlChain
  iconSize?: number
  nameSize?: string
} & BadgeProps) {
  return (
    <Wrap spacing="xs">
      {tokens.map(token => {
        const nestedPool = 'nestedPool' in token ? token.nestedPool : undefined

        return (
          <Badge
            key={token.address}
            {...badgeProps}
            alignItems="center"
            bg="background.level2"
            borderColor="border.base"
            borderRadius="full"
            borderWidth={1}
            display="flex"
            shadow="sm"
            textTransform="none"
          >
            <HStack gap={['xs', 'sm']}>
              {!nestedPool && (
                <>
                  <TokenIcon
                    address={token.address}
                    alt={token.symbol}
                    chain={chain}
                    size={iconSize}
                  />
                  <HStack gap={['xs', '1.5']}>
                    {tokens.length < 5 && (
                      <Text
                        fontWeight="bold"
                        noOfLines={1}
                        size={nameSize}
                        _groupHover={{ color: 'font.maxContrast' }}
                        transition="color 0.2s var(--ease-out-cubic)"
                        color={'white'}
                      >
                        {token.symbol}
                      </Text>
                    )}
                    <Text
                      fontSize="xs"
                      _groupHover={{ color: 'font.maxContrast' }}
                      transition="color 0.2s var(--ease-out-cubic)"
                      color={'white'}
                    >
                      {fNum('weight', token.weight || '')}
                    </Text>
                  </HStack>
                </>
              )}
              {nestedPool && (
                <>
                  <NestedTokenPill
                    chain={chain}
                    iconSize={iconSize}
                    nestedTokens={nestedPool.tokens}
                  />
                  <HStack gap={['xs', '1.5']}>
                    <Text
                      fontWeight="bold"
                      noOfLines={1}
                      size={nameSize}
                      _groupHover={{ color: 'font.maxContrast' }}
                      transition="color 0.2s var(--ease-out-cubic)"
                      color={'white'}
                    >
                      {token.name}
                    </Text>
                    <Text
                      fontSize="xs"
                      _groupHover={{ color: 'font.maxContrast' }}
                      transition="color 0.2s var(--ease-out-cubic)"
                    >
                      {fNum('weight', token.weight || '')}
                    </Text>
                  </HStack>
                </>
              )}
            </HStack>
          </Badge>
        )
      })}
    </Wrap>
  )
}

function StableTokenPills({
  tokens,
  chain,
  iconSize = 24,
  nameSize,
  ...badgeProps
}: {
  tokens: (PoolToken | ApiToken)[]
  chain: GqlChain
  iconSize?: number
  nameSize?: string
} & BadgeProps) {
  const isFirstToken = (index: number) => index === 0
  const zIndices = Array.from({ length: tokens.length }, (_, index) => index + 1).reverse()

  return (
    <HStack spacing={0}>
      {tokens.map((token, i) => {
        const nestedPool = 'nestedPool' in token ? token.nestedPool : undefined
        return (
          <Badge
            key={[token.address, token.chain, i].join('-')}
            {...badgeProps}
            alignItems="center"
            bg="background.level2"
            borderColor="border.base"
            borderRadius="full"
            borderWidth={1}
            display="flex"
            ml={isFirstToken(i) ? 0 : -10}
            pl={[isFirstToken(i) ? 1 : 12, isFirstToken(i) ? 2 : 12]}
            shadow="sm"
            textTransform="none"
            zIndex={zIndices[i]}
          >
            <HStack gap={['xs', '1.5']}>
              {!nestedPool && (
                <>
                  <TokenIcon
                    address={token.address}
                    alt={token.symbol}
                    chain={chain}
                    size={iconSize}
                  />
                  {tokens.length < 5 && (
                    <Text
                      fontWeight="bold"
                      noOfLines={1}
                      size={nameSize}
                      _groupHover={{ color: 'font.maxContrast' }}
                      transition="color 0.2s var(--ease-out-cubic)"
                      color={'white'}
                    >
                      {token.symbol}
                    </Text>
                  )}
                </>
              )}
              {nestedPool && (
                <>
                  <NestedTokenPill
                    chain={chain}
                    iconSize={iconSize}
                    nestedTokens={nestedPool.tokens}
                  />
                  <Text
                    fontWeight="bold"
                    noOfLines={1}
                    size={nameSize}
                    _groupHover={{ color: 'font.maxContrast' }}
                    transition="color 0.2s var(--ease-out-cubic)"
                  >
                    {token.name}
                  </Text>
                </>
              )}
            </HStack>
          </Badge>
        )
      })}
    </HStack>
  )
}

type VotingListTokenPillsProps = {
  vote: VotingPoolWithData
  iconSize?: number
  nameSize?: string
} & BadgeProps

export function VotingListTokenPills({ vote, ...props }: VotingListTokenPillsProps) {
  const pool = voteToPool(vote)
  const { name } = usePoolMetadata(pool)
  const tokens = getUserReferenceTokens(pool)

  return (
    <PoolTokenPills
      chain={pool.chain}
      poolName={name}
      poolType={pool.type}
      tokens={tokens}
      {...props}
    />
  )
}

type PoolListTokenPillsProps = {
  pool: PoolCore
  iconSize?: number
  nameSize?: string
} & BadgeProps

export function PoolListTokenPills({ pool, ...props }: PoolListTokenPillsProps) {
  const { name, iconUrl } = usePoolMetadata(pool)
  const tokens = getUserReferenceTokens(pool)

  return (
    <PoolTokenPills
      chain={pool.chain}
      iconUrl={iconUrl}
      poolName={name}
      poolType={pool.type}
      tokens={tokens}
      {...props}
    />
  )
}

type PoolTokenPillsProps = {
  poolType: GqlPoolType
  chain: GqlChain
  tokens: (PoolToken | ApiToken)[]
  poolName: string | undefined
  iconUrl?: string
  iconSize?: number
  nameSize?: string
} & BadgeProps

function PoolTokenPills({
  chain,
  poolType,
  poolName,
  tokens,
  iconSize = 24,
  iconUrl,
  nameSize = 'md',
  ...badgeProps
}: PoolTokenPillsProps) {
  const shouldUseStablePills = isStableLike(poolType)
  const shouldUseWeightedPills = isWeightedLike(poolType)

  if (poolName) {
    return (
      <HStack>
        {iconUrl ? (
          <TokenIcon alt={poolName} logoURI={iconUrl} size={iconSize} />
        ) : (
          <TokenIconStack chain={chain} size={iconSize} tokens={tokens} />
        )}
        <Heading sx={{ color: 'white' }} color={'white'} size={nameSize}>
          {poolName}
        </Heading>
      </HStack>
    )
  }

  if (shouldUseStablePills) {
    return (
      <StableTokenPills
        sx={{ color: 'white' }}
        chain={chain}
        iconSize={iconSize}
        tokens={tokens}
        {...badgeProps}
      />
    )
  }

  if (shouldUseWeightedPills) {
    return (
      <WeightedTokenPills
        sx={{ color: 'white' }}
        chain={chain}
        iconSize={iconSize}
        tokens={tokens}
        {...badgeProps}
      />
    )
  }

  return (
    <WeightedTokenPills
      sx={{ color: 'white' }}
      chain={chain}
      iconSize={iconSize}
      tokens={tokens}
      {...badgeProps}
    />
  )
}
