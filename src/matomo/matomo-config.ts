import { visitorCountriesLoader } from "./loaders/visitor-countries-loader";
import { actionLoader } from "./loaders/actions-loader";
import type { MatomoSiteConfig, SiteConfig } from "./matomo-types";
import { eventLoader } from "./loaders/event-loader";

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
    ],
  },
];

export const oldmatomoConfig: MatomoSiteConfig[] = [
  {
    events: [
      "FileTreeDrop",
      "CSV Export",
      "CSV with hashes Export",
      "Tree CSV Export",
      "METS Export",
      "Excel Export",
      "RESIP Export",
      "Audit report export",
    ],
    idSite: ARCHIFILTRE_APP_ID,
    visitorCountries: true,
  },
  {
    actions: [
      {
        categoryId: 1,
      },
      {
        categoryId: 3,
      },
    ],
    events: ["download", "appDownload"],
    idSite: ARCHIFILTRE_SITE_ID,
    last30visits: true,
    monthlyEvents: ["download", "appDownload"],
    visits: true,
  },
];
