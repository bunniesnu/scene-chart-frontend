import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ChartType } from "@/types/chart"
import { $api } from "@/api"
import { Triangle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { getChartRankAt } from "@/utils/format"
import { getImgUrl } from "@/utils/img";

type ChartTableProps = {
  chartType: ChartType;
};

function ChartTable(chartTableProps: ChartTableProps) {
  const { data, isLoading, error } = $api.useQuery(
    "get",
    "/charts/{chart_type}",
    {
      params: {
        path: {
          chart_type: chartTableProps.chartType,
        },
      }
    }
  )
  return <>
    <div className="mx-auto w-min whitespace-nowrap text-gray-500 font-semibold">{data ? getChartRankAt(data.entries[0].snapshot.rank_day, data.entries[0].snapshot.rank_hour) : "----.--.-- --:-- KST"}</div>
    <Card className="w-full [--card-spacing:--spacing(2)] py-0 mt-4">
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10 text-center">Rank</TableHead>
              <TableHead className="pl-14">Song</TableHead>
              <TableHead className="w-10 text-center">Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? <TableRow>
              <TableCell colSpan={3} className="text-center text-gray-400 h-20">Loading...</TableCell>
            </TableRow> : (error ? <TableRow>
                <TableCell colSpan={3} className="text-center text-gray-400 h-20">Error</TableCell>
              </TableRow> : (data ? data.entries.map((item, index) => {
                let rankChangeBadge = <Badge className="bg-gray-200 text-gray-400 text-sm text-center min-w-11">
                  -
                </Badge>
                if (item.snapshot.rank_type === "UP") {
                  rankChangeBadge = <Badge className="bg-red-200 text-red-400 text-sm text-center min-w-11">
                    <Triangle fill="currentColor" />
                    {item.snapshot.rank_gap}
                  </Badge>
                } else if (item.snapshot.rank_type === "DOWN") {
                  rankChangeBadge = <Badge className="bg-green-200 text-green-400 text-sm text-center min-w-11">
                    <Triangle fill="currentColor" className="rotate-180" />
                    {item.snapshot.rank_gap}
                  </Badge>
                }
                return (
                  <TableRow key={item.song.song_id}>
                    <TableCell className="text-center text-lg">{item.snapshot.current_rank}</TableCell>
                    <TableCell>
                      {item.song.album_cover_url && <img src={getImgUrl(item.song.album_cover_url)} className="inline-block mr-2 w-10 h-10 rounded-md" />}
                      {item.song.title}
                    </TableCell>
                    <TableCell className="text-center">
                      {rankChangeBadge}
                    </TableCell>
                  </TableRow>
                )
              }) : <TableRow>
                <TableCell colSpan={3} className="text-center text-gray-400 h-20">No data</TableCell>
              </TableRow>))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </>
}

export default ChartTable
