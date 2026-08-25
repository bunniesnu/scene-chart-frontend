import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import ChartTable from "@/components/chart/table"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-wrap items-center gap-2 md:flex-row">
        <ChartTable chartType="top100" />
      </div>
    </QueryClientProvider>
  )
}

export default App
