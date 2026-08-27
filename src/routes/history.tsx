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
import { useState } from 'react';
import { SongSelector } from '@/components/song/selector';
import { $api } from '@/api';

export const Route = createFileRoute('/history')({
  component: RouteComponent,
})

function RouteComponent() {
  const songs = $api.useQuery(
    "get",
    "/artist/songs",
  )
  const [selectedSongs, setSelectedSongs] = useState<string[]>([
    "37928381",
    "602450078",
    "39231685",
    "601719493"
  ])
  return <Tabs className="w-full max-w-3xl flex flex-col items-center justify-center gap-4 p-4" defaultValue={defaultChartType}>
      <TabsList>
        {chartTypes.map((type) => (
          <TabsTrigger key={type} value={type}>
            {chartTypeLabels[type]}
          </TabsTrigger>
        ))}
      </TabsList>
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
      {chartTypes.map((type) => (
        <TabsContent key={type} value={type} className="w-full">
          <RankHistoryChart songIds={selectedSongs} chartType={type} />
        </TabsContent>
      ))}
    </Tabs>
}
