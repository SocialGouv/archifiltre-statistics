import type { ArchifiltreCountStatistic } from "../../api-types";
import type {
  ApiParams,
  Loader,
  MatomoEventCategory,
  MatomoEventConfig,
} from "../matomo-types";
import {
  sanitizeMatomoEventConfig,
  createMatomoRequestBaseParams,
} from "./loader-utils";
import * as querystring from "querystring";

type EventLoaderOptions = {
  label: string;
};

type CreateMatomoEventCategoryMethodParams = {
  config: MatomoEventConfig;
  idSite: number;
  date?: [string, string];
};

const createMatomoEventCategoryMethod = ({
  config,
  idSite,
  date,
}: CreateMatomoEventCategoryMethodParams) => {
  const { label } = sanitizeMatomoEventConfig(config);
  return querystring.stringify(
    {
      ...createMatomoRequestBaseParams(idSite, date),
      label,
      method: "Events.getCategory",
    },
    "&",
    "=",
    { encodeURIComponent: (val) => val }
  );
};

const eventQuery = ({ label }: EventLoaderOptions) => ({ idSite }: ApiParams) =>
  createMatomoEventCategoryMethod({ idSite, config: label });

export const formatEventsResponse = () => (
  eventCategories: MatomoEventCategory[]
): ArchifiltreCountStatistic[] =>
  eventCategories.map(({ label, nb_events }) => ({
    label,
    value: nb_events,
  }));

const eventAggregator = ({ label }: EventLoaderOptions) => (response: any) => {
  console.log("event aggregator ", response);
  return formatEventsResponse()(response);
};

export const eventLoader = ({ label }: EventLoaderOptions): Loader => ({
  query: eventQuery({ label }),
  aggregator: eventAggregator({ label }),
});
