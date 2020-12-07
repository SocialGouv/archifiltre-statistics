import { config } from "dotenv";

config();

export const matomoToken: string = process.env.MATOMO_TOKEN || "";
export const matomoUrl: string = process.env.MATOMO_URL || "";
