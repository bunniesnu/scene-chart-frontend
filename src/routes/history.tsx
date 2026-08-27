import { createFileRoute } from '@tanstack/react-router'
import { chartTypeLabels, chartTypes, type ChartType } from "@/types/chart"
import { $api } from "@/api"
import { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { RankHistoryChart } from '@/components/chart/history';
import { defaultChartType } from '@/const';

export const Route = createFileRoute('/history')({
  component: RouteComponent,
})

function RouteComponent() {
  const [chartType, setChartType] = useState<ChartType>(defaultChartType)
  const { data, isLoading, error } = $api.useQuery(
    "get",
    "/charts/history/{chart_type}",
    {
      params: {
        path: {
          chart_type: chartType,
        },
        query: {
          songs: ["37928381"]
        }
      }
    }
  )
  return <Tabs className="w-full max-w-3xl flex flex-col items-center justify-center gap-4 p-4" defaultValue={defaultChartType}>
      <TabsList>
        {chartTypes.map((type) => (
          <TabsTrigger key={type} value={type}>
            {chartTypeLabels[type]}
          </TabsTrigger>
        ))}
      </TabsList>
      {chartTypes.map((type) => (
        <TabsContent key={type} value={type} className="w-full">
          <RankHistoryChart data={data?.entries[0].snapshots ?? []} />
        </TabsContent>
      ))}
    </Tabs>
}
