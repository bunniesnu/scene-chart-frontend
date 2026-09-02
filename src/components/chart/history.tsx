import type { ChartType } from "@/types/chart";
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
import { useQueries } from "@tanstack/react-query";
import { defaultStaleTime } from "@/const";

type Props = {
  songIds: string[];
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

export function RankHistoryChart({ songIds, chartType, dateFrom, dateTo }: Props) {
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
        {
          staleTime: defaultStaleTime,
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