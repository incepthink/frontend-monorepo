import {
  Box,
  Grid,
  GridItem,
  GridItemProps,
  GridProps,
  HStack,
  IconButton,
  Text,
  Tooltip,
  useToken,
  VStack,
} from '@chakra-ui/react'
import Link from 'next/link'
import { NetworkIcon } from '@repo/lib/shared/components/icons/NetworkIcon'
import { useCurrency } from '@repo/lib/shared/hooks/useCurrency'
import FadeInOnView from '@repo/lib/shared/components/containers/FadeInOnView'
import { VotingPoolWithData } from '@repo/lib/modules/vebal/vote/vote.types'
import { VotingListTokenPills } from '@repo/lib/modules/pool/PoolList/PoolListTokenPills'
import { getPoolPath } from '@repo/lib/modules/pool/pool.utils'
import { ArrowUpIcon } from '@repo/lib/shared/components/icons/ArrowUpIcon'
import { VoteExpiredTooltip } from '@bal/lib/vebal/vote/VoteExpiredTooltip'
import { Trash2 } from 'react-feather'
import { useMyVotes } from '@bal/lib/vebal/vote/Votes/MyVotes/MyVotesProvider'
import { VoteWeightInput } from '@bal/lib/vebal/vote/Votes/MyVotes/MyVotesTable/VoteWeightInput'
import {
  bpsToPercentage,
  calculateMyValuePerVote,
  calculateMyVoteRewardsValue,
  inputPercentageWeightToBps,
  votingTimeLockedEndDate,
} from '@bal/lib/vebal/vote/Votes/MyVotes/myVotes.helpers'

import { useVotes } from '@bal/lib/vebal/vote/Votes/VotesProvider'
import { VoteWeight } from '@bal/lib/vebal/vote/Votes/MyVotes/VoteWeight'
import { isVotingTimeLocked } from '@bal/lib/vebal/vote/Votes/MyVotes/myVotes.helpers'
import { useVebalUserData } from '@bal/lib/vebal/useVebalUserData'
import { bn } from '@repo/lib/shared/utils/numbers'
import { canReceiveIncentives, useBlacklistedVotes } from '../incentivesBlacklist'
import { useVebalLockInfo } from '@bal/lib/vebal/useVebalLockInfo'
import { useUserAccount } from '@repo/lib/modules/web3/UserAccountProvider'
import { useLastUserSlope } from '../../../useVeBALBalance'
import { Address } from 'viem'
import { useTokens } from '@repo/lib/modules/tokens/TokensProvider'

interface Props extends GridProps {
  vote: VotingPoolWithData
  totalVotes: bigint
  keyValue: string | number
  cellProps: GridItemProps
}

export function MyVotesTableRow({ vote, totalVotes, keyValue, cellProps, ...rest }: Props) {
  const { userAddress } = useUserAccount()

  const { editVotesWeights, onEditVotesChange } = useMyVotes()
  const {
    votingPools,
    isSelectedPool,
    toggleVotingPool,
    allowChangeVotes,
    vebalLockTooShort,
    isPoolGaugeExpired,
    vebalIsExpired,
  } = useVotes()
  const { toCurrency } = useCurrency()

  const isGaugeExpired = isPoolGaugeExpired(vote)

  const editVotes = bpsToPercentage(editVotesWeights[vote.id] ?? 0).multipliedBy(100)

  const removable = isSelectedPool(vote)

  const timeLocked = isVotingTimeLocked(vote.gaugeVotes?.lastUserVoteTime ?? 0)

  const onRemove = () => {
    toggleVotingPool(vote)
  }

  const [fontSecondary] = useToken('colors', ['font.secondary'])

  const { noVeBALBalance } = useVebalUserData()
  const { slope } = useLastUserSlope(userAddress)

  const isDisabled = timeLocked || !allowChangeVotes || (vebalIsExpired ?? true) || isGaugeExpired

  const { mainnetLockedInfo } = useVebalLockInfo()
  const lockEnd = mainnetLockedInfo.lockedEndDate
  const { blacklistedVotes } = useBlacklistedVotes(votingPools)
  const { priceFor } = useTokens()
  const rewards = calculateMyVoteRewardsValue(
    editVotesWeights[vote.id] ?? 0,
    vote,
    slope,
    lockEnd,
    totalVotes,
    blacklistedVotes[vote.gauge.address as Address],
    priceFor
  )
  const averageRewards = calculateMyValuePerVote(
    editVotesWeights[vote.id] ?? 0,
    vote,
    slope,
    lockEnd,
    totalVotes,
    blacklistedVotes[vote.gauge.address as Address],
    priceFor
  )

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
        <Grid {...rest} pr="4" py={{ base: 'ms', md: 'md' }}>
          <GridItem {...cellProps}>
            <NetworkIcon chain={vote.chain} size={6} />
          </GridItem>
          <GridItem {...cellProps}>
            <Link className="group" href={getPoolPath(vote)} target="_blank">
              <HStack>
                <VotingListTokenPills
                  h={['32px', '36px']}
                  iconSize={20}
                  p={['xxs', 'sm']}
                  pr={[1.5, 'ms']}
                  vote={vote}
                />
                {isGaugeExpired && <VoteExpiredTooltip usePortal />}
                <Box
                  _groupHover={{ color: 'font.highlight', transform: 'rotate(45deg)' }}
                  color="font.secondary"
                  transform="rotate(90deg)"
                  transition="all 0.2s var(--ease-out-cubic)"
                >
                  <ArrowUpIcon />
                </Box>
              </HStack>
            </Link>
          </GridItem>
          <GridItem justifySelf="end" textAlign="right" {...cellProps}>
            {vote.votingIncentive && canReceiveIncentives(userAddress) ? (
              <Text>{toCurrency(rewards, { abbreviated: false })}</Text>
            ) : (
              <Text color="red.400">&mdash;</Text>
            )}
          </GridItem>
          <GridItem justifySelf="end" textAlign="right" {...cellProps}>
            {vote.votingIncentive && canReceiveIncentives(userAddress) ? (
              <Text>
                {toCurrency(averageRewards, {
                  abbreviated: false,
                  forceThreeDecimals: true,
                })}
              </Text>
            ) : (
              <Text color="red.400">&mdash;</Text>
            )}
          </GridItem>
          <GridItem justifySelf="end" textAlign="right" {...cellProps}>
            <VoteWeight
              isGaugeExpired={isGaugeExpired}
              timeLocked={timeLocked}
              timeLockedEndDate={votingTimeLockedEndDate(vote.gaugeVotes?.lastUserVoteTime ?? 0)}
              variant="primary"
              weight={bn(vote.gaugeVotes?.userVotes || '0')}
            />
          </GridItem>
          <GridItem justifySelf="end" textAlign="right" {...cellProps}>
            <VoteWeightInput
              isDisabled={isDisabled}
              isGaugeExpired={isGaugeExpired}
              isLockExpired={vebalIsExpired}
              isTimeLocked={timeLocked}
              isTooShort={vebalLockTooShort}
              lastVoteTime={vote.gaugeVotes?.lastUserVoteTime}
              max={100}
              min={0}
              noBalance={noVeBALBalance}
              percentage={editVotes.toString()}
              pr="32px"
              setPercentage={value =>
                onEditVotesChange(vote.id, inputPercentageWeightToBps(value).toString())
              }
              step={0.01}
              textAlign="right"
              width="100px"
            />
          </GridItem>
          <GridItem {...cellProps}>
            <VStack align="center" w="full">
              <Tooltip
                isDisabled={removable}
                label="You have an existing vote, so this row cannot be removed from the table. Set it to 0% to reallocate your vote."
              >
                <IconButton
                  _hover={{
                    bg: 'red.500',
                    color: 'white',
                  }}
                  aria-label="Remove"
                  color={fontSecondary}
                  icon={<Trash2 height="20px" />}
                  isDisabled={!removable}
                  onClick={onRemove}
                  variant="ghost"
                />
              </Tooltip>
            </VStack>
          </GridItem>
        </Grid>
      </Box>
    </FadeInOnView>
  )
}
