import { meanBy, round } from "lodash";

import type { ArchifiltreCountStatistic } from "../api-types";
import type { Answer, TypeformDataItem } from "./typeform-types";

const getValueFromAnswerType = (answers: Answer[], type: string) =>
  answers.find((answer) => answer.field.type === type)?.number;

export const sanitizeData = (
  items: TypeformDataItem[]
): ArchifiltreCountStatistic[] => {
  const answers = items.map((item) => ({
    opinion: getValueFromAnswerType(item.answers, "opinion_scale"),
    rating: getValueFromAnswerType(item.answers, "rating"),
  }));

  const averageRating = round(meanBy(answers, "rating"), 1);
  const averageOpinion = round(meanBy(answers, "opinion") * 10);

  return [
    {
      label: "rating",
      value: averageRating,
    },
    {
      label: "recommendation",
      value: averageOpinion,
    },
  ];
};
