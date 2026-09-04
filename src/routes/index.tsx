import { createFileRoute } from '@tanstack/react-router'
import ChartTable from "@/components/chart/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { chartTypeLabels, chartTypes, isChartType } from "@/types/chart"
import { defaultChartType } from '@/const';

export const Route = createFileRoute('/')({
  validateSearch: (search) => ({
    chartType: isChartType(search.chartType) ? search.chartType : defaultChartType
  }),
  component: Index,
})

function Index() {
  const { chartType } = Route.useSearch()
  const navigate = Route.useNavigate()
  return <Tabs className="w-full flex flex-col items-center justify-center gap-4 p-4" value={chartType} onValueChange={(value) => navigate({ search: { chartType: value } })}>
    <TabsList>
      {chartTypes.map((type) => (
        <TabsTrigger key={type} value={type}>
          {chartTypeLabels[type]}
        </TabsTrigger>
      ))}
    </TabsList>
    <TabsContent value={chartType} className="w-full">
      <ChartTable chartType={chartType} />
    </TabsContent>
  </Tabs>
}
