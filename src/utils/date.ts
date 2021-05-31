import {
  differenceInWeeks,
  endOfWeek,
  formatISO,
  startOfWeek,
  subWeeks,
} from "date-fns";
import { range } from "lodash";

import { RELEASE_DATE_3_2 } from "../matomo/loaders/loader-utils";

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

export const getMatomoLastWeeksRange = getLastWeeksRanges(
  differenceInWeeks(Date.now(), new Date(RELEASE_DATE_3_2))
);
