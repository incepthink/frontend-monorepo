import { GqlPoolType } from '@repo/lib/shared/services/api/generated/graphql'
import { useParams } from 'next/navigation'
import { createContext, PropsWithChildren, useMemo, useState } from 'react'
import { PoolVariant, BaseVariant } from '../../../pool.types'
import { usePool } from '../../../PoolProvider'
import { useMandatoryContext } from '@repo/lib/shared/utils/contexts'
import { PoolChartPeriod } from './PoolChartsProvider'

export enum PoolChartTab {
  VOLUME = 'volume',
  TVL = 'tvl',
  FEES = 'fees',
  SURPLUS = 'surplus',
  LIQUIDITY_PROFILE = 'liquidity_profile',
  RECLAMM = 'reclamm',
  PRICE = 'price',
}

export interface PoolChartTypeTab {
  value: PoolChartTab
  label: string
}

type PoolTabsMap = {
  [key in GqlPoolType]?: PoolChartTypeTab[]
} & {
  default: PoolChartTypeTab[] // Make default required
}

const BASE_TABS: PoolChartTypeTab[] = [
  { value: PoolChartTab.VOLUME, label: 'Volume' },
  { value: PoolChartTab.TVL, label: 'TVL' },
]

const TABS_WITH_FEES: PoolChartTypeTab[] = [
  ...BASE_TABS,
  { value: PoolChartTab.FEES, label: 'Fees' },
]

const POOL_SPECIFIC_TABS: PoolTabsMap = {
  [GqlPoolType.CowAmm]: [...BASE_TABS, { value: PoolChartTab.SURPLUS, label: 'Surplus' }],
  [GqlPoolType.Gyroe]: [
    { value: PoolChartTab.LIQUIDITY_PROFILE, label: 'Liquidity profile' },
    ...TABS_WITH_FEES,
  ],
  [GqlPoolType.Reclamm]: [{ value: PoolChartTab.RECLAMM, label: 'reCLAMM' }, ...TABS_WITH_FEES],
  [GqlPoolType.LiquidityBootstrapping]: [
    { value: PoolChartTab.PRICE, label: 'Price' },
    ...TABS_WITH_FEES,
  ],
  default: TABS_WITH_FEES,
}

export function getPoolTabsList({
  variant,
  poolType,
}: {
  variant: PoolVariant
  poolType: GqlPoolType
}): PoolChartTypeTab[] {
  // LBP pools in v2 only show base tabs
  if (poolType === GqlPoolType.LiquidityBootstrapping && variant === BaseVariant.v2) {
    return BASE_TABS
  }

  // Return pool-specific tabs or default tabs
  return POOL_SPECIFIC_TABS[poolType] || POOL_SPECIFIC_TABS.default
}

export type PoolChartTabsResponse = ReturnType<typeof usePoolChartTabsLogic>

export const PoolChartTabsContext = createContext<PoolChartTabsResponse | null>(null)

export function usePoolChartTabsLogic() {
  const { pool } = usePool()
  const { variant } = useParams()

  const tabsList = useMemo(() => {
    const poolType = pool?.type
    if (!poolType || typeof variant !== 'string') return []

    return getPoolTabsList({
      variant: variant as PoolVariant,
      poolType: poolType,
    })
  }, [pool?.type, variant])

  const [activeTab, setActiveTab] = useState(tabsList[0])

  function getActiveTabLabel(activePeriod: PoolChartPeriod) {
    switch (activeTab.value) {
      case PoolChartTab.TVL:
        return 'Total value locked'
      case PoolChartTab.FEES:
        return `${activePeriod.label} fees`
      case PoolChartTab.VOLUME:
        return `${activePeriod.label} volume`
    }
  }

  return {
    tabsList,
    activeTab,
    setActiveTab,
    getActiveTabLabel,
  }
}

export function PoolChartTabsProvider({ children }: PropsWithChildren) {
  const hook = usePoolChartTabsLogic()
  return <PoolChartTabsContext.Provider value={hook}>{children}</PoolChartTabsContext.Provider>
}

export const usePoolChartTabs = (): PoolChartTabsResponse =>
  useMandatoryContext(PoolChartTabsContext, 'PoolChartTabs')
