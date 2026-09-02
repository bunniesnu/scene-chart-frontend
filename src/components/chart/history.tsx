import type { ChartType, ChartTypeWithRankHour } from "@/types/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import { $api } from "@/api"
import { useQueries, useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type ChartProps = {
  songIds: string[];
  chartType: ChartType;
  dateFrom: Date;
  dateTo: Date;
};

type TableProps = {
  songId: string;
  chartType: ChartType;
  dateFrom: Date;
  dateTo: Date;
};

type ChartDataPoint = {
  timestamp: number;
  snapshots: Record<string, number>;
};

const TIME_ZONE = "Asia/Seoul";

function formatTick(value: number, includeTime: boolean = true) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(value));

  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";

  const year = get("year");
  const month = get("month");
  const day = get("day");
  const hour = get("hour");
  const minute = get("minute");

  // return `${year}-${month}-${day} ${hour}:${minute}`;
  return includeTime ? `${year}-${month}-${day} ${hour}:${minute}` : `${year}-${month}-${day}`;
}

export function RankHistoryChart({ songIds, chartType, dateFrom, dateTo }: ChartProps) {
  const history = useQueries({
    queries: songIds.map((songId) =>
      $api.queryOptions(
        "get",
        "/charts/history/{chart_type}",
        {
          params: {
            path: {
              chart_type: chartType,
            },
            query: {
              songId: songId,
            }
          }
        },
      )
    ),
  });

  const chartData: ChartDataPoint[] = Object.values(
    history.reduce<
      Record<number, ChartDataPoint>
    >((acc, entry) => {
      if (!entry.data?.entry) {
        return acc;
      }
      const songId = entry.data.entry.song.song_id;

      for (const point of entry.data.entry.snapshots) {
        if (
          (new Date(point.rank_day)).getTime() < (new Date(dateFrom.getFullYear(), dateFrom.getMonth(), dateFrom.getDate(), 0, 0, 0)).getTime()
          || (new Date(point.rank_day)).getTime() > (new Date(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate(), 23, 59, 59)).getTime()
        ) {
          continue;
        }
        const timestamp = new Date(
          point.rank_hour !== null ? `${point.rank_day} ${point.rank_hour}` : point.rank_day,
        ).getTime();

        if (!acc[timestamp]) {
          acc[timestamp] = {
            timestamp,
            snapshots: {},
          };
        }

        acc[timestamp].snapshots[songId] =
          point.current_rank;
      }

      return acc;
    }, {}) ?? {},
  ).sort((a, b) => a.timestamp - b.timestamp);

  if (chartData.length === 0) {
    return null;
  }

  const maxRank = Math.max(
    ...chartData.flatMap((entry) =>
      Object.values(entry.snapshots),
    ),
  );

  const yAxisMax =
    maxRank <= 5
      ? 5
      : maxRank <= 10
        ? 10
        : maxRank <= 20
          ? 20
          : maxRank <= 50
            ? 50
            : maxRank <= 100
              ? 100
              : Math.ceil(maxRank / 50) * 50;

  const tickStep =
    yAxisMax <= 5
      ? 1
      : yAxisMax <= 20
        ? 2
        : yAxisMax <= 50
          ? 5
          : 10;

  const yAxisTicks = Array.from(
    {
      length:
        Math.floor((yAxisMax - 1) / tickStep) + 1,
    },
    (_, index) => index * tickStep,
  );

  const chartConfig = Object.fromEntries(
    songIds.map((songId, index) => [
      songId,
      {
        label: history.find((entry) => entry.data?.entry?.song.song_id === songId)?.data?.entry?.song.title ?? songId,
        color: `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
      },
    ]),
  );

  const showChartTime = chartType !== "daily" && chartType !== "weekly";

  return (
    <ChartContainer
      config={chartConfig}
      className="h-100 w-full"
    >
      <LineChart
        data={chartData}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 0,
        }}
      >
        <CartesianGrid
          vertical={false}
          strokeDasharray="3 3"
        />

        <XAxis
          dataKey="timestamp"
          type="number"
          scale="time"
          domain={["dataMin", "dataMax"]}
          minTickGap={50}
          tickFormatter={(value) => formatTick(value, showChartTime)}
          angle={-30}
          textAnchor="end"
          height={65}
          tickMargin={8}
        />

        <YAxis
          reversed
          domain={[0, yAxisMax]}
          ticks={yAxisTicks}
          allowDecimals={false}
          width={45}
        />

        <ChartTooltip
          content={
            <ChartTooltipContent
              labelKey="timestamp"
              labelFormatter={(_, payload) =>
                payload?.[0]?.payload?.timestamp
                  ? formatTick(payload[0].payload.timestamp, showChartTime)
                  : ""
              }
            />
          }
        />

        {songIds.map((songId, index) => (
          <Line
            key={songId}
            type="monotone"
            dataKey={`snapshots.${songId}`}
            name={songId}
            stroke={`hsl(${(index * 137.5) % 360}, 70%, 50%)`}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
            connectNulls={false}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
}

interface TableWithRankHourProps extends TableProps {
  chartType: ChartTypeWithRankHour;
}

export function RankHistoryTable({ songId, chartType, dateFrom, dateTo }: TableProps) {
  if (chartType === "top100" || chartType === "realtime" || chartType === "hot100") {
    return <RankHistoryTableWithRankHour
      songId={songId}
      chartType={chartType}
      dateFrom={dateFrom}
      dateTo={dateTo}
    />
  }
}

function RankHistoryTableWithRankHour({ songId, chartType, dateFrom, dateTo }: TableWithRankHourProps) {
  const history = useQuery(
    $api.queryOptions(
      "get",
      "/charts/history/{chart_type}",
      {
        params: {
          path: {
            chart_type: chartType,
          },
          query: {
            songId: songId,
          }
        }
      },
    )
  );
  const tableRows = history.data ? Object.values(
    history.data.entry.snapshots
    .filter((snapshot) => {
      const snapshotDate = new Date(snapshot.rank_day);
      return snapshotDate >= new Date(dateFrom.getFullYear(), dateFrom.getMonth(), dateFrom.getDate(), 0, 0, 0)
        && snapshotDate <= new Date(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate(), 23, 59, 59);
    })
    .reduce<
      Record<
        string,
        {
          rank_day: string;
          ranks: {
            rank: number;
            rank_hour: number;
          }[];
        }
      >
    >((acc, snapshot) => {
      const { rank_day, current_rank, rank_hour } = snapshot;

      if (!acc[rank_day]) {
        acc[rank_day] = {
          rank_day,
          ranks: [],
        };
      }

      if (rank_hour === null) {
        throw new Error(`Missing rank_hour for ${rank_day}`);
      }

      acc[rank_day].ranks.push({
        rank: current_rank,
        rank_hour: Number(rank_hour.split(":")[0]),
      });

      return acc;
    }, {})
  ) : null;
  return <Table>
    <TableHeader>
      <TableRow>
        <TableHead className="text-center">Date</TableHead>
        {Array.from(Array(24).keys()).map((value, index) => (
          <TableHead key={index} className="w-12 text-center">{value}</TableHead>
        ))}
      </TableRow>
    </TableHeader>
    <TableBody>
      {tableRows ? tableRows.map((row) => {
        const ranksByHour = Object.fromEntries(
          row.ranks.map((rank) => [rank.rank_hour, rank.rank]),
        );
        return (
          <TableRow key={row.rank_day}>
            <TableCell className="text-center">{row.rank_day}</TableCell>
            {Array.from(Array(24).keys()).map((hour) => (
              <TableCell key={hour} className="text-center">
                {ranksByHour[hour] ?? "-"}
              </TableCell>
            ))}
          </TableRow>
        );
      }) : <TableRow>
        <TableCell colSpan={25} className="text-center text-gray-400 h-20">No data</TableCell>
      </TableRow>}
    </TableBody>
  </Table>
}