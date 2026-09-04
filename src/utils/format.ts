export const formatDateTime = (date: Date, includeTime: boolean) => {
  if (includeTime) {
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")} KST`;
  }
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")} KST`;
}

export const getChartRankAt = (rank_day: string, rank_hour: string | null) => {
  if (rank_hour === null) {
    const date = new Date(rank_day)
    return formatDateTime(date, false)
  }
  const date = new Date(rank_day + " " + (rank_hour ?? "00:00"))
  return formatDateTime(date, true)
}

export function getYearWeek(date: Date): { year: number; week: number } {
  const year = date.getFullYear();

  const jan4 = new Date(year, 0, 4);

  // First Sunday on or after Jan 4
  const firstSunday = new Date(
    year,
    0,
    4 + (7 - jan4.getDay()) % 7,
  );

  // Before this year's week 1 → last week of previous year
  if (date < firstSunday) {
    const previousYear = year - 1;
    const previousJan4 = new Date(previousYear, 0, 4);

    const previousFirstSunday = new Date(
      previousYear,
      0,
      4 + (7 - previousJan4.getDay()) % 7,
    );

    const diffDays = Math.floor(
      (firstSunday.getTime() - previousFirstSunday.getTime()) /
        (1000 * 60 * 60 * 24),
    );

    const lastWeek = Math.floor(diffDays / 7);

    return {
      year: previousYear,
      week: lastWeek,
    };
  }

  const diffDays = Math.floor(
    (date.getTime() - firstSunday.getTime()) /
      (1000 * 60 * 60 * 24),
  );

  return {
    year,
    week: Math.floor(diffDays / 7) + 1,
  };
}