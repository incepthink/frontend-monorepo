'use client'

import { PaginatedTable } from '@repo/lib/shared/components/tables/PaginatedTable'
import { VoteListTableHeader } from './VoteListTableHeader'
import { VoteListTableRow } from './VoteListTableRow'
import { getPaginationProps } from '@repo/lib/shared/components/pagination/getPaginationProps'
import { Card, Skeleton } from '@chakra-ui/react'
import { useIsMounted } from '@repo/lib/shared/hooks/useIsMounted'
import { VotingPoolWithData } from '@repo/lib/modules/vebal/vote/vote.types'
import { useVoteList } from '@bal/lib/vebal/vote/VoteList/VoteListProvider'
import { useMemo } from 'react'

interface Props {
  voteList: VotingPoolWithData[]
  count: number
  loading: boolean
}

const rowProps = {
  px: { base: 'sm', sm: '0' },
  gridTemplateColumns: `32px minmax(320px, 1fr) minmax(144px, max-content) minmax(100px, max-content) minmax(140px, max-content) minmax(120px, max-content) minmax(96px, max-content)`,
  alignItems: 'center',
  gap: { base: 'xxs', xl: 'lg' },
}

export function VoteListTable({ voteList, count, loading }: Props) {
  const isMounted = useIsMounted()
  const {
    filtersState: { pagination, setPagination },
  } = useVoteList()
  const paginationProps = getPaginationProps(count || 0, pagination, setPagination)
  const showPagination = !!voteList.length && !!count && count > pagination.pageSize

  const TableHeader = useMemo(() => {
    return function TableHeader() {
      return <VoteListTableHeader {...rowProps} />
    }
  }, [])

  // Memoize component's link to skip recreation
  const TableRow = useMemo(() => {
    return function TableRow({ item, index }: { item: VotingPoolWithData; index: number }) {
      return <VoteListTableRow keyValue={index} vote={item} {...rowProps} />
    }
  }, [])

  if (!isMounted) return <Skeleton height="500px" w="full" />

  return (
    <Card
      alignItems="flex-start"
      left={{ base: '-4px', sm: '0' }}
      mb="2xl"
      p={{ base: '0', sm: '0' }}
      position="relative"
      pr={{ base: 'lg', sm: 'lg', md: 'lg', lg: '0' }} // fixing right padding for horizontal scroll on mobile
      w={{ base: '100vw', lg: 'full' }}
    >
      <PaginatedTable
        getRowId={(item, index) => `${item.id}#${index}`}
        items={voteList}
        loading={loading}
        noItemsFoundLabel="No votes found"
        paginationProps={paginationProps}
        renderTableHeader={TableHeader}
        renderTableRow={TableRow}
        showPagination={showPagination}
      />
    </Card>
  )
}
