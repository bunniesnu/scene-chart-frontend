import { addWeeks } from "date-fns"
import { createFileRoute } from '@tanstack/react-router'
import { chartTypeLabels, chartTypes } from "@/types/chart"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { RankHistoryChart } from '@/components/chart/history';
import { defaultChartType, defaultSelectedSongsForHistory } from '@/const';
import { useState } from 'react';
import { SongSelector } from '@/components/song/selector';
import { $api } from '@/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePickerWithRange } from '@/components/dateRangePicker';

type HistoryShowStyleType = "chart" | "table"
const HistoryShowStyles: HistoryShowStyleType[] = ["chart", "table"]
const HistoryShowStyleLabels: Record<HistoryShowStyleType, string> = {
  chart: "Chart",
  table: "Table",
}

export const Route = createFileRoute('/history')({
  component: RouteComponent,
})

function RouteComponent() {
  const songs = $api.useQuery(
    "get",
    "/artist/songs",
  )
  const [dateFrom, setDateFrom] = useState<Date>(addWeeks(new Date(), -1))
  const [dateTo, setDateTo] = useState<Date>(new Date())
  const [selectedSongs, setSelectedSongs] = useState<string[]>(defaultSelectedSongsForHistory)
  const [historyShowStyle, setHistoryShowStyle] = useState<HistoryShowStyleType>("chart")
  return <Tabs className="w-full flex flex-col items-center justify-center gap-4 p-4" defaultValue={defaultChartType}>
      <TabsList>
        {chartTypes.map((type) => (
          <TabsTrigger key={type} value={type}>
            {chartTypeLabels[type]}
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="mx-auto w-fit max-w-full flex flex-wrap items-center justify-center gap-4">
        <ToggleGroup variant="outline" defaultValue={[HistoryShowStyles[0]]} onValueChange={(value) => setHistoryShowStyle(value[0] as HistoryShowStyleType)}>
          {HistoryShowStyles.map((style) => (
            <ToggleGroupItem key={style} value={style} aria-label={`Toggle ${style}`}>
              {HistoryShowStyleLabels[style]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <SongSelector
          songs={songs.data ? songs.data?.songs : []}
          value={selectedSongs}
          onValueChange={(value) => {
            if (selectedSongs.includes(value)) {
              setSelectedSongs(selectedSongs.filter((songId) => songId !== value))
            } else {
              setSelectedSongs([...selectedSongs, value])
            }
          }}
        />
        <DatePickerWithRange
          from={dateFrom}
          to={dateTo}
          onFromChange={setDateFrom}
          onToChange={setDateTo}
        />
      </div>
      {chartTypes.map((type) => (
        <TabsContent key={type} value={type} className="w-full">
          <Card size="sm" className="w-full">
            <CardHeader>
              <CardTitle>
                <span className="text-lg font-semibold pl-1">
                  Melon Rank History - {chartTypeLabels[type]}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {{
                "chart": <RankHistoryChart songIds={selectedSongs} chartType={type} dateFrom={dateFrom} dateTo={dateTo} />,
                "table": <div>Table view is not implemented yet.</div>
              }[historyShowStyle]}
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
}
