import type { paths } from "@/api.d"

export type ChartType =
  paths["/charts/{chart_type}"]["get"]["parameters"]["path"]["chart_type"];

export const chartTypes: ChartType[] = ["top100", "realtime", "hot100", "daily", "weekly"]

export const chartTypeLabels: Record<ChartType, string> = {
  top100: "Top100",
  realtime: "Realtime",
  hot100: "Hot100",
  daily: "Daily",
  weekly: "Weekly",
}