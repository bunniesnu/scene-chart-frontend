import { createFileRoute } from '@tanstack/react-router'
import { chartTypeLabels, chartTypes, type ChartType } from "@/types/chart"
import { $api } from "@/api"
import { useState } from 'react';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
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
  return <div className="w-full max-w-xl flex flex-col items-center justify-center gap-4 p-4">
    <div className="flex items-center gap-4">
      <Combobox items={chartTypes} defaultValue={defaultChartType} itemToStringLabel={(value) => value ? chartTypeLabels[value] : ""} onValueChange={(value: ChartType | null) => setChartType(value ? value : defaultChartType)}>
        <ComboboxInput placeholder="Chart Type" />
        <ComboboxContent>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item: ChartType) => (
              <ComboboxItem key={item} value={item}>
                {chartTypeLabels[item]}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  </div>
}
