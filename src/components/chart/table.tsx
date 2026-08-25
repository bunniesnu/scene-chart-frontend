import {
  Table,
  TableBody,
  // TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ChartType } from "@/types/chart"
import { $api } from "@/api"
import { Triangle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

type ChartTableProps = {
  chartType: ChartType;
};

function ChartTable(ChartTableProps: ChartTableProps) {
  const { data, isLoading, error } = $api.useQuery(
    "get",
    "/charts/{chart_type}",
    {
      params: {
        path: {
          chart_type: ChartTableProps.chartType,
        },
      }
    }
  )
  return (
    <Table>
      {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
      <TableHeader>
        <TableRow>
          <TableHead className="w-10 text-center">Rank</TableHead>
          <TableHead className="pl-14">Song</TableHead>
          <TableHead className="w-10 text-center">Change</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.entries.map((item, index) => {
          let rankChangeBadge = <Badge className="bg-gray-200 text-gray-400 text-sm text-center min-w-11">
            -
          </Badge>
          if (item.snapshot.rank_type == "UP") {
            rankChangeBadge = <Badge className="bg-red-200 text-red-400 text-sm text-center min-w-11">
              <Triangle fill="currentColor" />
              {item.snapshot.rank_gap}
            </Badge>
          } else if (item.snapshot.rank_type == "DOWN") {
            rankChangeBadge = <Badge className="bg-green-200 text-green-400 text-sm text-center min-w-11">
              <Triangle fill="currentColor" />
            </Badge>
          }
          return (
            <TableRow key={item.song.song_id}>
              <TableCell className="text-center">{item.snapshot.current_rank}</TableCell>
              <TableCell>
                <img src={`//wsrv.nl?url=${item.song.album_cover_url?.split("?")[0]}&w=100&h=100&output=webp&il`} className="inline-block mr-2 w-10 h-10 rounded-md" />
                {item.song.title}
              </TableCell>
              <TableCell className="text-center">
                {rankChangeBadge}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export default ChartTable
