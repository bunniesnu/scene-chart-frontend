import { createFileRoute } from '@tanstack/react-router'
import ChartTable from "@/components/chart/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { chartTypeLabels, chartTypes } from "@/types/chart"
import { defaultChartType } from '@/const';

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
return <Tabs className="w-full max-w-xl flex flex-col items-center justify-center gap-4 p-4" defaultValue={defaultChartType}>
    <TabsList>
      {chartTypes.map((type) => (
        <TabsTrigger key={type} value={type}>
          {chartTypeLabels[type]}
        </TabsTrigger>
      ))}
    </TabsList>
    {chartTypes.map((type) => (
      <TabsContent key={type} value={type} className="w-full">
        <ChartTable chartType={type} />
      </TabsContent>
    ))}
  </Tabs>
}
