import { ReactNode, useEffect, useState } from 'react'
import {
  Box,
  BoxProps,
  Center,
  Divider,
  Text,
  Spinner,
  VStack,
  Skeleton,
  StyleProps,
} from '@chakra-ui/react'
import { Pagination, PaginationProps } from '@repo/lib/shared/components/pagination/Pagination'

interface Props<T> extends BoxProps {
  items: T[]
  loading: boolean
  renderTableHeader: () => ReactNode
  renderTableRow: (props: { item: T; index: number }) => ReactNode
  showPagination: boolean
  paginationProps: PaginationProps | undefined
  noItemsFoundLabel: string
  getRowId: (item: T, index: number) => React.Key
  loadingLength?: number
  paginationStyles?: StyleProps
}

export function PaginatedTable<T>({
  items,
  loading,
  renderTableRow: TableRow,
  renderTableHeader: TableHeader,
  showPagination,
  paginationProps,
  noItemsFoundLabel,
  getRowId,
  loadingLength = 20,
  paginationStyles,
}: Props<T>) {
  const [previousPageCount, setPreviousPageCount] = useState(0)

  useEffect(() => {
    if (paginationProps && paginationProps.totalPageCount !== previousPageCount) {
      setPreviousPageCount(paginationProps.totalPageCount)
      paginationProps.goToFirstPage()
    }
  }, [paginationProps, previousPageCount])

  return (
    <>
      <Box className="hide-scrollbar" overflowX="auto" width="100%" backgroundColor={'transparent'}>
        {/* Use table layout for more predictable width behavior */}
        <Box display="table" width="100%" minWidth="600px">
          {/* Header */}
          <Box display="table-header-group">
            <Box display="table-row">
              <TableHeader />
            </Box>
            {/* Divider below header */}
            <Box display="table-row">
              <Box display="table-cell">
                <Divider borderColor="gray.600" />
              </Box>
            </Box>
          </Box>

          {/* Body */}
          <Box display="table-row-group">
            {items.length > 0 &&
              items.map((item, index) => (
                <Box key={getRowId(item, index)} display="table-row">
                  <TableRow index={index} item={item} />
                </Box>
              ))}

            {!loading && items.length === 0 && (
              <Box display="table-row">
                <Box display="table-cell">
                  <Center py="2xl">
                    <Text px="md" color="white">
                      {noItemsFoundLabel}
                    </Text>
                  </Center>
                </Box>
              </Box>
            )}

            {loading &&
              items.length === 0 &&
              Array.from({ length: loadingLength }).map((_, index) => (
                <Box key={`table-row-skeleton-${index}`} display="table-row">
                  <Box display="table-cell" px="xs" py="xs">
                    <Skeleton height="68px" w="full" />
                  </Box>
                </Box>
              ))}
          </Box>
        </Box>

        {loading && items.length > 0 && (
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg="blackAlpha.500"
            backdropFilter="blur(3px)"
            zIndex={10}
          >
            <Spinner size="xl" />
          </Box>
        )}
      </Box>

      {showPagination && paginationProps && (
        <>
          <Divider width="100%" />
          <Box width="100%">
            <Pagination p="md" {...paginationProps} {...paginationStyles} />
          </Box>
        </>
      )}
    </>
  )
}
