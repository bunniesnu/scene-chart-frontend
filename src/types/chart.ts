import type { paths } from "@/api.d"

export type ChartType =
  paths["/charts/{chart_type}"]["get"]["parameters"]["path"]["chart_type"];