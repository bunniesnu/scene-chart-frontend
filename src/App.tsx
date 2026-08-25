import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import ChartTable from "@/components/chart/table"
import type { ChartType } from "@/types/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const queryClient = new QueryClient()

const chartTypes: ChartType[] = ["top100", "realtime", "hot100", "daily", "weekly"]

const chartTypeLabels: Record<ChartType, string> = {
  top100: "Top100",
  realtime: "Realtime",
  hot100: "Hot100",
  daily: "Daily",
  weekly: "Weekly",
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Tabs className="w-full max-w-xl flex flex-col items-center justify-center gap-4 p-4" defaultValue="top100">
        <TabsList>
          {chartTypes.map((type) => (
            <TabsTrigger key={type} value={type}>
              {chartTypeLabels[type]}
            </TabsTrigger>
          ))}
        </TabsList>
        {chartTypes.map((type) => (
          <TabsContent key={type} value={type} className="w-full border rounded-xl">
            <ChartTable chartType={type} />
          </TabsContent>
        ))}
      </Tabs>
    </QueryClientProvider>
  )
}

export default App
