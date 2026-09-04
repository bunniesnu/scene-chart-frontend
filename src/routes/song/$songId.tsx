import { createFileRoute } from '@tanstack/react-router'
import { ArrowUpRightIcon } from "lucide-react"
import { $api } from '@/api';
import { getImgUrl } from '@/utils/img';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Badge } from '@/components/ui/badge';
import { formatDate } from 'date-fns';
import { formatTime } from '@/utils/format';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithData } from '@/components/table';
import { chartTypeLabels } from '@/types/chart';

export const Route = createFileRoute('/song/$songId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { songId } = Route.useParams()
  const songs = $api.useQuery(
    "get",
    "/artist/songs",
  )
  const songChartData = $api.useQuery(
    "get",
    "/charts",
    {
      params: {
        query: {
          songId: songId,
        }
      }
    }
  )
  const song = songs.data?.songs.find((song) => song.song_id === songId)
  if (!song) {
    return <div className="w-full flex flex-col items-center justify-center gap-4 p-4">
      <Item variant="outline" className="w-full">
        <ItemContent>
          <ItemTitle className="text-2xl font-medium">
            Song Not Found
          </ItemTitle>
          <ItemDescription>The song with ID {songId} was not found.</ItemDescription>
        </ItemContent>
      </Item>
    </div>
  }
  return <div className="w-full flex flex-col items-center justify-center gap-4 p-4">
    <Item variant="outline" className="w-full">
      {song.album_cover_url && <ItemMedia variant="image" className="w-1/4 h-fit">
        <img src={getImgUrl(song.album_cover_url, 'm')} className="w-full" />
      </ItemMedia>}
      <ItemContent>
        <ItemTitle className="text-2xl font-medium">
          {song.is_title_song && <Badge variant="secondary" className="text-xs text-center min-w-11">TITLE</Badge>}
          {song.title}
        </ItemTitle>
        <ItemDescription>{song.album_name}</ItemDescription>
        {song.issue_date && <ItemDescription>{formatDate(new Date(song.issue_date.split(".").join("-")), "yyyy-MM-dd")}</ItemDescription>}
        {song.play_time && <ItemDescription>{formatTime(song.play_time)}</ItemDescription>}
      </ItemContent>
    </Item>
    <Card size="sm" className="w-full">
      <CardHeader>
        <CardTitle>
          <a href={`https://www.melon.com/song/detail.htm?songId=${song.song_id}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
            <span className="text-lg font-semibold pl-1">
              Melon
            </span>
            <ArrowUpRightIcon className="w-4 h-4" />
          </a>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {Object.entries(chartTypeLabels).map(([chartType, label]) => (
                <TableHead key={chartType} className="text-center">{label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableWithData colSpan={5} isLoading={songChartData.isLoading} error={songChartData.error}>
              <TableRow>
              {Object.entries(chartTypeLabels).map(([chartType, _]) => (
                <TableCell key={chartType} className="text-center">
                  {songChartData.data?.snapshots.find((chart) => chart.chart_type === chartType)?.current_rank ?? "-"}
                </TableCell>
              ))}
              </TableRow>
            </TableWithData>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
}
