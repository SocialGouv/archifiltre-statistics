import type { ArchifiltreCountStatistic } from "../api-types";

export type MatomoEventCategory = {
  label: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  nb_events: number;
};

export type MatomoEventConfigObject = {
  label: string;
  value?: string;
};

export type MatomoActionConfigObject = {
  categoryId: number;
};

export type MatomoEventConfig = MatomoEventConfigObject | string;

export type MatomoSiteConfig = {
  idSite: number;
  events?: MatomoEventConfig[];
  actions?: MatomoActionConfigObject[];
  monthlyEvents?: MatomoEventConfig[];
  last30visits?: boolean;
  visits?: boolean;
  visitorCountries?: boolean;
};

export type MatomoUserCountry = {
  code: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  nb_visits: number;
};

export type MaybePromise<T> = T | Promise<T>;

export type ApiParams = {
  idSite: number;
};

export type Loader = {
  query: (params: ApiParams) => string;
  aggregator: (queryResponse: any) => ArchifiltreCountStatistic[];
};

export type SiteConfig = {
  idSite: number;
  loaders: Loader[];
};
