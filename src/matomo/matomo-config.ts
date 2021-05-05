import {
  last30DaysVisitsLoader,
  totalVisitsLoader,
} from "./loaders/visits-loader";
import { visitorCountriesLoader } from "./loaders/visitor-countries-loader";
import { actionLoader } from "./loaders/actions-loader";
import type { SiteConfig } from "./matomo-types";
import { eventLoader, monthlyEventLoaders } from "./loaders/event-loader";

const ARCHIFILTRE_SITE_ID = 20;
const ARCHIFILTRE_APP_ID = 9;

export const matomoConfig: SiteConfig[] = [
  {
    idSite: ARCHIFILTRE_APP_ID,
    loaders: [
      eventLoader({ label: "FileTreeDrop" }),
      eventLoader({ label: "CSV Export" }),
      eventLoader({ label: "CSV with hashes Export" }),
      eventLoader({ label: "Tree CSV Export" }),
      eventLoader({ label: "METS Export" }),
      eventLoader({ label: "Excel Export" }),
      eventLoader({ label: "RESIP Export" }),
      eventLoader({ label: "Audit report export" }),
      visitorCountriesLoader(),
    ],
  },
  {
    idSite: ARCHIFILTRE_SITE_ID,
    loaders: [
      actionLoader({ categoryId: 1 }),
      actionLoader({ categoryId: 3 }),
      eventLoader({ label: "download" }),
      eventLoader({ label: "appDownload" }),
      totalVisitsLoader(),
      last30DaysVisitsLoader(),
      ...monthlyEventLoaders({ label: "download" }),
      ...monthlyEventLoaders({ label: "appDownload" }),
    ],
  },
];
