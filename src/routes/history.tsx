import { addDays, addWeeks } from "date-fns"
import { createFileRoute } from '@tanstack/react-router'
import { chartTypeLabels, chartTypes, isChartType, type ChartType } from "@/types/chart"
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
import { RankHistoryChart, RankHistoryTable } from '@/components/chart/history';
import { defaultChartType, defaultSelectedSongForHistoryTable, defaultSelectedSongsForHistory, ResceneDebutDate } from '@/const';
import { useState } from 'react';
import { SongSelectorMultiple, SongSelectorSingle } from '@/components/song/selector';
import { $api } from '@/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePickerWithRange } from '@/components/dateRangePicker';
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";

type HistoryShowStyleType = "chart" | "table"
const HistoryShowStyles: HistoryShowStyleType[] = ["chart", "table"]
const HistoryShowStyleLabels: Record<HistoryShowStyleType, string> = {
  chart: "Chart",
  table: "Table",
}

export const Route = createFileRoute('/history')({
  validateSearch: (search) => ({
    chartType: isChartType(search.chartType) ? search.chartType : defaultChartType
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { chartType } = Route.useSearch()
  const navigate = Route.useNavigate()
  const songs = $api.useQuery(
    "get",
    "/artist/songs",
  )
  const [dateFrom, setDateFrom] = useState<Date>(addWeeks(new Date(), -1))
  const [dateTo, setDateTo] = useState<Date>(new Date())
  const [selectedSongs, setSelectedSongs] = useState<string[]>(defaultSelectedSongsForHistory)
  const [historyShowStyle, setHistoryShowStyle] = useState<HistoryShowStyleType>("chart")
  const [selectedTableSong, setSelectedTableSong] = useState<string>(defaultSelectedSongForHistoryTable)
  return <Tabs className="w-full flex flex-col items-center justify-center gap-4 p-4" value={chartType} onValueChange={(value: ChartType) => navigate({ search: { chartType: value } })}>
      <TabsList>
        {chartTypes.map((type) => (
          <TabsTrigger key={type} value={type}>
            {chartTypeLabels[type]}
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="mx-auto w-fit max-w-full flex flex-wrap items-center justify-center gap-4">
        <ToggleGroup variant="outline" defaultValue={[historyShowStyle]} onValueChange={(value) => setHistoryShowStyle(value[0] as HistoryShowStyleType)}>
          {HistoryShowStyles.map((style) => (
            <ToggleGroupItem key={style} value={style} aria-label={`Toggle ${style}`}>
              {HistoryShowStyleLabels[style]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        {{
          chart: <SongSelectorMultiple
            songs={songs.data ? songs.data?.songs : []}
            value={selectedSongs}
            onValueChange={(value) => {
              if (selectedSongs.includes(value)) {
                setSelectedSongs(selectedSongs.filter((songId) => songId !== value))
              } else {
                setSelectedSongs([...selectedSongs, value])
              }
            }}
          />,
          table: <SongSelectorSingle
            songs={songs.data ? songs.data?.songs : []}
            value={selectedTableSong}
            onValueChange={(value) => {
              setSelectedTableSong(value)
            }}
          />,
        }[historyShowStyle]}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <ButtonGroup>
            <Button variant="outline" onClick={() => {
              setDateFrom(addDays(new Date(), -3))
              setDateTo(new Date())
            }}>3 days</Button>
            <Button variant="outline" onClick={() => {
              setDateFrom(addWeeks(new Date(), -1))
              setDateTo(new Date())
            }}>7 days</Button>
            <Button variant="outline" onClick={() => {
              setDateFrom(ResceneDebutDate)
              setDateTo(new Date())
            }}>All time</Button>
          </ButtonGroup>
          <DatePickerWithRange
            from={dateFrom}
            to={dateTo}
            onFromChange={setDateFrom}
            onToChange={setDateTo}
          />
        </div>
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
            <CardContent className="max-h-[calc(100dvh-20rem)] overflow-auto">
              {{
                chart: <RankHistoryChart songIds={selectedSongs} chartType={type} dateFrom={dateFrom} dateTo={dateTo} />,
                table: <RankHistoryTable songId={selectedTableSong} chartType={type} dateFrom={dateFrom} dateTo={dateTo} />
              }[historyShowStyle]}
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
}
