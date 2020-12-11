import { config } from "dotenv";

config();

export const port: number = parseInt(process.env.PORT ?? "") || 3000;
export const matomoToken: string = process.env.MATOMO_TOKEN ?? "";
export const matomoUrl: string = process.env.MATOMO_URL ?? "";
export const youtubeApiUrl: string = process.env.YOUTUBE_API_URL ?? "";
export const youtubeApiKey: string = process.env.YOUTUBE_API_KEY ?? "";
export const youtubeChannelId: string = process.env.YOUTUBE_CHANNEL_ID ?? "";
export const githubApiUrl: string = process.env.GITHUB_API_URL ?? "";
export const githubApiKey: string = process.env.GITHUB_API_KEY ?? "";
export const corsOrigins: string = process.env.CORS_ORIGINS ?? "";
