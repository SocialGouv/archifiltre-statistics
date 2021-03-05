import { endOfMonth, formatISO, startOfMonth, subMonths } from "date-fns";
import { range } from "lodash";

export const getLastMonthsRanges = (monthCount: number) => (
  now: Date
): [string, string][] =>
  range(monthCount)
    .map((index) => subMonths(now, index))
    .map((date, index): [Date, Date] => [
      startOfMonth(date),
      index === 0 ? date : endOfMonth(date),
    ])
    .map(
      (dates): [string, string] =>
        dates.map((date) => formatISO(date, { representation: "date" })) as [
          string,
          string
        ]
    );
