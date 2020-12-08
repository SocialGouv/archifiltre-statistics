import { GlobalEnvironment } from "@socialgouv/kosko-charts/types";

export default {
  subdomain: `${process.env.CI_COMMIT_REF_SLUG}-${
    process.env.CI_PROJECT_NAME as string
  }`,
} as Partial<GlobalEnvironment>;
