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
};
