import env from "@kosko/env";

import { create } from "@socialgouv/kosko-charts/components/app";
import { getHarborImagePath } from "@socialgouv/kosko-charts/utils";

const manifests = create("app", {
  env,
  config: {
    containerPort: 3000,
    image: getHarborImagePath({ name: "archifiltre-statistics" }),
  },
  deployment: {
    container: {
      resources: {
        requests: {
          cpu: "2m",
          memory: "128Mi",
        },
        limits: {
          cpu: "500m",
          memory: "1280Mi",
        },
      },
    },
  },
});

export default manifests;
