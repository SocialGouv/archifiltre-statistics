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

export type MatomoRequestConfig = MatomoEventConfig | MatomoActionConfigObject;

export type MatomoEventConfig = string | MatomoEventConfigObject;

export type MatomoSiteConfig = {
  idSite: number;
  events?: MatomoEventConfig[];
  actions?: MatomoActionConfigObject[];
};
