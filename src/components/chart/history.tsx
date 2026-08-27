import type { ChartType } from "@/types/chart";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { $api } from "@/api"

type Props = {
  songIds: string[];
  chartType: ChartType;
};

const TIME_ZONE = "Asia/Seoul";

function formatTick(value: number) {
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

  return `${year}-${month}-${day} ${hour}:${minute}`;
}

function formatTooltip(value: unknown) {
  if (typeof value !== "number") {
    return [String(value), "Rank"];
  }

  return [`${value}`, "Rank"];
}

export function RankHistoryChart({ songIds, chartType }: Props) {
  const history = $api.useQuery(
    "get",
    "/charts/history/{chart_type}",
    {
      params: {
        path: {
          chart_type: chartType,
        },
        query: {
          songs: songIds
        }
      }
    }
  )
  const chartData = (history.data && history.data.entries.length > 0) ? history.data.entries.map(
    (entry) => (
      {
        songId: entry.song.song_id,
        snapshots: entry.snapshots.map((point) => ({
          ...point,
          timestamp: new Date(
            `${point.rank_day} ${point.rank_hour}`,
          ).getTime(),
        }))
        .sort((a, b) => a.timestamp - b.timestamp)
      }
    )): [];

  if (chartData.length === 0) {
    return null;
  }

  const maxRank = Math.max(
    ...chartData.map((entry) => Math.max(...entry.snapshots.map((point) => point.current_rank))),
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

  return (
    <ResponsiveContainer
      width="100%"
      height={400}
    >
      <LineChart
        data={chartData}
        margin={{
          top: 20,
          right: 20,
          bottom: 80,
          left: 20,
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
          tickFormatter={formatTick}
          angle={-45}
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

        <Tooltip
          labelFormatter={(value) =>
            new Intl.DateTimeFormat("ko-KR", {
              timeZone: TIME_ZONE,
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hourCycle: "h23",
            }).format(new Date(Number(value)))
          }
          formatter={formatTooltip}
        />

        {chartData.map((entry) => (
          <Line
            key={entry.songId}
            type="monotone"
            dataKey="current_rank"
            data={entry.snapshots}
            name={entry.songId}
            stroke={`hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}