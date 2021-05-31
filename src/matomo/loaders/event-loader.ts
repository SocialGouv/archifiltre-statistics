import * as querystring from "querystring";

import type { ArchifiltreCountStatistic } from "../../api-types";
import type {
  ApiParams,
  Loader,
  MatomoEventCategory,
  MatomoEventConfig,
} from "../matomo-types";
import {
  createMatomoRequestBaseParams,
  sanitizeMatomoEventConfig,
} from "./loader-utils";

export type EventLoaderOptions = {
  label: string;
  period?: string;
};

type CreateMatomoEventCategoryMethodParams = {
  config: MatomoEventConfig;
  idSite: number;
  period?: string;
  date?: [string, string];
};

const createMatomoEventCategoryMethod = ({
  config,
  idSite,
  date,
  period,
}: CreateMatomoEventCategoryMethodParams) => {
  const { label } = sanitizeMatomoEventConfig(config);
  return querystring.stringify(
    {
      ...createMatomoRequestBaseParams(idSite, date),
      label,
      method: "Events.getCategory",
      period: period ?? "range",
    },
    "&",
    "=",
    { encodeURIComponent: (val) => val }
  );
};

export const eventQuery = ({ label, period }: EventLoaderOptions) => ({
  idSite,
}: ApiParams): string =>
  createMatomoEventCategoryMethod({ config: label, idSite, period });

export const formatEventsResponse = () => (
  eventCategories: MatomoEventCategory[]
): ArchifiltreCountStatistic[] =>
  // eslint-disable-next-line @typescript-eslint/naming-convention
  eventCategories.map(({ label, nb_events }) => ({
    label,
    value: nb_events,
  }));

const eventAggregator = () => (response: MatomoEventCategory[]) =>
  formatEventsResponse()(response);

export const eventLoader = ({ label, period }: EventLoaderOptions): Loader => ({
  aggregator: eventAggregator(),
  query: eventQuery({ label, period }),
});
