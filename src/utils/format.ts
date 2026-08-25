export const formatDateTime = (date: Date, includeTime: boolean) => {
  if (includeTime) {
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")} KST`;
  }
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")} KST`;
}

export const getChartRankAt = (rank_day: string | null, rank_hour: string | null, fetched_at: string) => {
  console.log(rank_day, rank_hour, fetched_at)
  if (rank_day === null) {
    const date = new Date(fetched_at)
    date.setDate(date.getDate() - 1)
    return formatDateTime(date, false)
  } else if (rank_hour === null) {
    const date = new Date(rank_day.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3"))
    return formatDateTime(date, false)
  }
  const date = new Date(rank_day + " " + (rank_hour ?? "00:00"))
  return formatDateTime(date, true)
}