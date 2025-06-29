import { Box, Grid, GridItem, GridProps, HStack, Text, Image } from '@chakra-ui/react'
import { PoolListTableDetailsCell } from '@repo/lib/modules/pool/PoolList/PoolListTable/PoolListTableDetailsCell'
import FadeInOnView from '@repo/lib/shared/components/containers/FadeInOnView'
import { NetworkIcon } from '@repo/lib/shared/components/icons/NetworkIcon'
import MainAprTooltip from '@repo/lib/shared/components/tooltips/apr-tooltip/MainAprTooltip'
import { useCurrency } from '@repo/lib/shared/hooks/useCurrency'
import Link from 'next/link'
import { memo } from 'react'
import { usePoolMetadata } from '../../metadata/usePoolMetadata'
import { PoolListItem } from '../../pool.types'
import { getPoolPath } from '../../pool.utils'
import { getUserTotalBalanceUsd } from '../../user-balance.helpers'
import { usePoolList } from '../PoolListProvider'
import { PoolListPoolDisplay } from '../PoolListPoolDisplay'

interface Props extends GridProps {
  pool: PoolListItem
  keyValue: number
  needsMarginForPoints?: boolean
}

const MemoizedMainAprTooltip = memo(MainAprTooltip)

export function PoolListTableRow({ pool, keyValue, needsMarginForPoints, ...rest }: Props) {
  const {
    queryState: { userAddress },
    poolDisplayType,
  } = usePoolList()
  const { name } = usePoolMetadata(pool)
  const { toCurrency } = useCurrency()

  const hasPoints = pool.tags?.some(tag => tag === 'POINTS')

  return (
    <FadeInOnView>
      <Box
        _hover={{
          bg: 'background.level0',
        }}
        key={keyValue}
        px={{ base: '0', sm: 'md' }}
        rounded="md"
        transition="all 0.2s ease-in-out"
        w="full"
      >
        <Link href={getPoolPath(pool)} prefetch role="group">
          <Grid {...rest} pr="4" py={{ base: 'ms', md: 'md' }}>
            <GridItem>
              <NetworkIcon chain={pool.chain} size={6} />
            </GridItem>
            <GridItem>
              <PoolListPoolDisplay name={name} pool={pool} poolDisplayType={poolDisplayType} />
            </GridItem>
            <GridItem minW="32">
              <PoolListTableDetailsCell pool={pool} />
            </GridItem>
            {userAddress ? (
              <GridItem>
                <Text fontWeight="medium" textAlign="right" color={'white'}>
                  {toCurrency(getUserTotalBalanceUsd(pool), { abbreviated: false })}
                </Text>
              </GridItem>
            ) : null}
            <GridItem>
              <Text
                color={'white'}
                fontWeight="medium"
                textAlign="right"
                title={toCurrency(pool.dynamicData.totalLiquidity, { abbreviated: false })}
              >
                {toCurrency(pool.dynamicData.totalLiquidity)}
              </Text>
            </GridItem>
            <GridItem textAlign="right">
              <Text
                color={'white'}
                fontWeight="medium"
                textAlign="right"
                title={toCurrency(pool.dynamicData.volume24h, { abbreviated: false })}
              >
                {toCurrency(pool.dynamicData.volume24h)}
              </Text>
            </GridItem>
            <GridItem justifySelf="end" pr={{ base: 'md', xl: '0' }}>
              <HStack gap="xxs" mr={needsMarginForPoints && !hasPoints ? '12px' : '0'}>
                <MemoizedMainAprTooltip
                  aprItems={pool.dynamicData.aprItems}
                  chain={pool.chain}
                  height="auto"
                  pool={pool}
                  poolId={pool.id}
                  textProps={{ fontWeight: 'medium', textAlign: 'right', color: 'white' }}
                />
                {hasPoints && (
                  <Image
                    alt="points"
                    h="15px"
                    ml="0.5"
                    src="/images/icons/pool-points.svg"
                    w="10px"
                  />
                )}
              </HStack>
            </GridItem>
          </Grid>
        </Link>
      </Box>
    </FadeInOnView>
  )
}
