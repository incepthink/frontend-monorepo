import { Grid, GridItem, Icon, Text, VStack } from '@chakra-ui/react'
import { Globe } from 'react-feather'
import { SortableHeader, Sorting } from '@repo/lib/shared/components/tables/SortableHeader'
import { PortfolioSortingData, portfolioOrderByFn } from './usePortfolioSorting'
import { PROJECT_CONFIG } from '@repo/lib/config/getProjectConfig'

const setIsDesc = (id: PortfolioSortingData['id'], currentSortingObj: PortfolioSortingData) =>
  currentSortingObj.id === id ? !currentSortingObj.desc : true

type Props = {
  currentSortingObj: PortfolioSortingData
  setCurrentSortingObj: (value: PortfolioSortingData) => void
}
export function PortfolioTableHeader({ currentSortingObj, setCurrentSortingObj, ...rest }: Props) {
  const portfolioOrderBy = portfolioOrderByFn(PROJECT_CONFIG.options.showVeBal)

  return (
    <Grid {...rest} p={['ms', 'md']} px="xs" w="full">
      <GridItem>
        <VStack align="start" w="full">
          <Icon as={Globe} boxSize="5" color="white" ml="1" />
        </VStack>
      </GridItem>
      <GridItem>
        <Text color={'white'} fontWeight="bold">
          Pool name
        </Text>
      </GridItem>
      <GridItem justifySelf="start">
        <Text fontWeight="bold" textAlign="left" color={'white'}>
          Details
        </Text>
      </GridItem>
      {portfolioOrderBy.map((orderByItem, index) => (
        <SortableHeader
          align={index === 0 ? 'left' : 'right'}
          isSorted={orderByItem.id === currentSortingObj.id}
          key={orderByItem.id}
          label={orderByItem.title}
          onSort={() => {
            if (orderByItem.id === currentSortingObj.id) {
              setCurrentSortingObj({
                id: orderByItem.id,
                desc: setIsDesc(orderByItem.id, currentSortingObj),
              })
            } else {
              setCurrentSortingObj({ id: orderByItem.id, desc: false })
            }
          }}
          sorting={currentSortingObj.desc ? Sorting.desc : Sorting.asc}
        />
      ))}
    </Grid>
  )
}
