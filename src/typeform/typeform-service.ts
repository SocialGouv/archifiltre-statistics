import axios from "axios";

import type { ArchifiltreCountStatistic } from "../api-types";
import { typeformApiKey, typeformApiUrl } from "../config";
import type { TypeformData } from "./typeform-types";
import { sanitizeData } from "./typeform-utils";

const formId = "lTwzr0dP";
const oldFormId = "FtY5Z2S8";

export const getTypeformData = async (): Promise<ArchifiltreCountStatistic[]> =>
  Promise.all(
    [oldFormId, formId].map(async (id) =>
      axios.get(
        `${typeformApiUrl}/forms/${id}/responses?page_size=1000&completed=true`,
        {
          headers: {
            authorization: `Bearer ${typeformApiKey}`,
          },
        }
      )
    )
  )
    .then((forms) =>
      forms.flatMap(({ data }: { data: TypeformData }) => data.items)
    )
    .then(sanitizeData)
    .catch((err) => {
      console.error(err);
      return [];
    });
