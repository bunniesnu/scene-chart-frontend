import { createFileRoute } from '@tanstack/react-router'
import { chartTypeLabels, chartTypes } from "@/types/chart"
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
          <RankHistoryChart chartType={type} />
        </TabsContent>
      ))}
    </Tabs>
}
