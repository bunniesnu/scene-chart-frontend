import {
  Table,
  TableBody,
  // TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { paths } from "@/api.d"
import { $api } from "@/api"

type ChartType =
  paths["/charts/{chart_type}"]["get"]["parameters"]["path"]["chart_type"];

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
          <TableHead>Song</TableHead>
          <TableHead className="w-10 text-center">Change</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.entries.map((item, index) => (
          <TableRow key={item.song.song_id}>
            <TableCell className="text-center">{item.snapshot.current_rank}</TableCell>
            <TableCell>{item.song.title}</TableCell>
            <TableCell className="text-center">{item.snapshot.rank_gap}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default ChartTable
