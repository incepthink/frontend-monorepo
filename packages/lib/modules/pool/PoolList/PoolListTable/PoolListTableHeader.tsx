'use client'

import { Grid, GridItem, Icon, Text, VStack } from '@chakra-ui/react'
import { GqlPoolOrderBy } from '@repo/lib/shared/services/api/generated/graphql'
import { orderByHash, PoolsColumnSort } from '../../pool.types'
import { usePoolOrderByState } from '../usePoolOrderByState'
import { Globe } from 'react-feather'
import { SortableHeader, Sorting } from '@repo/lib/shared/components/tables/SortableHeader'
import { usePoolList } from '../PoolListProvider'
import { PROJECT_CONFIG } from '@repo/lib/config/getProjectConfig'
import { PoolListPoolNamesTokens } from './PoolListPoolNamesTokens'

const setIsDesc = (id: GqlPoolOrderBy, currentSortingObj: PoolsColumnSort) =>
  currentSortingObj.id === id ? !currentSortingObj.desc : true

export function PoolListTableHeader({ ...rest }) {
  const {
    queryState: { sorting, setSorting, userAddress },
  } = usePoolList()
  const { orderBy } = usePoolOrderByState()
  const sortingObj = sorting[0]

  const handleSort = (newSortingBy: GqlPoolOrderBy) => {
    setSorting([
      {
        id: newSortingBy,
        desc: setIsDesc(newSortingBy, sortingObj),
      },
    ])
  }

  return (
    <Grid {...rest} p={['sm', 'md']} w="full" borderRadius={'16px 16px 0px 0px'}>
      <GridItem>
        <VStack align="start" w="full">
          <Icon as={Globe} boxSize="5" color="white" />
        </VStack>
      </GridItem>

      <GridItem sx={{ color: 'white' }}>
        <Text fontWeight="bold" color={'white'}>
          {PROJECT_CONFIG.options.showPoolName ? <PoolListPoolNamesTokens /> : 'Pool name'}
        </Text>
      </GridItem>

      <GridItem justifySelf="start">
        <Text sx={{ color: 'white' }} fontWeight="bold" textAlign="left">
          Details
        </Text>
      </GridItem>

      {/* Conditionally render user balance column header */}
      {userAddress && (
        <GridItem justifySelf="end">
          <Text sx={{ color: 'white' }} fontWeight="bold" textAlign="right">
            My Balance
          </Text>
        </GridItem>
      )}

      {orderBy.map(orderByItem => (
        <GridItem justifySelf="end" key={orderByItem}>
          <SortableHeader
            isSorted={sortingObj.id === orderByItem}
            label={orderByHash[orderByItem]}
            onSort={() => handleSort(orderByItem)}
            sorting={sortingObj.desc ? Sorting.desc : Sorting.asc}
          />
        </GridItem>
      ))}
    </Grid>
  )
}
