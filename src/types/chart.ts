import type { paths } from "@/api.d"

export type ChartType = paths["/charts/{chart_type}"]["get"]["parameters"]["path"]["chart_type"];

export type Song = paths["/artist/songs"]["get"]["responses"]["200"]["content"]["application/json"]["songs"][0];

export const chartTypes: ChartType[] = ["top100", "realtime", "hot100", "daily", "weekly"]

export type ChartTypeWithRankHour = Extract<ChartType, "top100" | "realtime" | "hot100">;

export const chartTypeLabels: Record<ChartType, string> = {
  top100: "Top100",
  realtime: "Realtime",
  hot100: "Hot100",
  daily: "Daily",
  weekly: "Weekly",
}

export const isChartType = (value: unknown): value is ChartType =>
  typeof value === "string" && chartTypes.includes(value as ChartType)