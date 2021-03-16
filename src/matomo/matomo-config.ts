import type { MatomoSiteConfig } from "./matomo-types";

export const matomoConfig: MatomoSiteConfig[] = [
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
    idSite: 9,
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
    idSite: 20,
    last30visits: true,
    monthlyEvents: ["download", "appDownload"],
    visits: true,
  },
];
