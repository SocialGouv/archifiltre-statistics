import {
  addDays,
  differenceInWeeks,
  endOfWeek,
  formatISO,
  startOfWeek,
  subWeeks,
} from "date-fns";
import { range } from "lodash";

export const getLastWeeksRanges = (weekCount: number) => (
  now: Date
): [string, string][] =>
  range(weekCount)
    .map((index) => subWeeks(now, index))
    .map((date, index): [Date, Date] => [
      startOfWeek(date),
      index === 0 ? date : endOfWeek(date),
    ])
    .map(
      (dates): [string, string] =>
        dates.map((date) => formatISO(date, { representation: "date" })) as [
          string,
          string
        ]
    );

export const getLastRangesChunks = (chunkSize: number) => (
  chunksCount: number
) => (startDate: Date): [string, string][] =>
  range(chunksCount)
    .map((index) => addDays(startDate, index * chunkSize))
    .map((date) => [date, addDays(date, chunkSize - 1)])
    .map(
      (dateRange) =>
        dateRange.map((date) =>
          formatISO(date, { representation: "date" })
        ) as [string, string]
    );

const DAYS_IN_WEEK = 7;

const getLastWeeksChunks = getLastRangesChunks(DAYS_IN_WEEK);

export const getMatomoLastWeeksRange = (
  now: Date,
  baseDate: Date
): [string, string][] =>
  getLastWeeksChunks(differenceInWeeks(now, baseDate) + 1)(baseDate);
