import { addWeeks } from "date-fns"
import { createFileRoute } from '@tanstack/react-router'
import { chartTypeLabels, chartTypes } from "@/types/chart"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { RankHistoryChart } from '@/components/chart/history';
import { defaultChartType, defaultSelectedSongsForHistory } from '@/const';
import { useState } from 'react';
import { SongSelector } from '@/components/song/selector';
import { $api } from '@/api';
import { Card, CardContent } from '@/components/ui/card';
import { DatePickerWithRange } from '@/components/dateRangePicker';

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
  return <Tabs className="w-full max-w-3xl flex flex-col items-center justify-center gap-4 p-4" defaultValue={defaultChartType}>
      <TabsList>
        {chartTypes.map((type) => (
          <TabsTrigger key={type} value={type}>
            {chartTypeLabels[type]}
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="mx-auto w-fit max-w-full flex flex-wrap items-center justify-center gap-4">
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
            <CardContent>
              <RankHistoryChart songIds={selectedSongs} chartType={type} dateFrom={dateFrom} dateTo={dateTo} />
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
}
