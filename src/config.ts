import { config } from "dotenv";

config();

export const port: number = parseInt(process.env.PORT || "") || 3000;
export const matomoToken: string = process.env.MATOMO_TOKEN || "";
export const matomoUrl: string = process.env.MATOMO_URL || "";
