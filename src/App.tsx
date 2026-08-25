import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import ChartTable from "@/components/chart/table"
import type { ChartType } from "@/types/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const queryClient = new QueryClient()

const chartTypes: ChartType[] = ["top100", "realtime", "hot100", "daily", "weekly"]

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Tabs>
        <TabsList>
          {chartTypes.map((type) => (
            <TabsTrigger key={type} value={type}>
              {type}
            </TabsTrigger>
          ))}
        </TabsList>
        {chartTypes.map((type) => (
          <TabsContent key={type} value={type}>
            <ChartTable chartType={type} />
          </TabsContent>
        ))}
      </Tabs>
    </QueryClientProvider>
  )
}

export default App
