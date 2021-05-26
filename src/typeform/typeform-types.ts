export type Answer = {
  field: {
    type: string;
  };
  number: number;
};

export type TypeformDataItem = {
  answers: Answer[];
};

export type TypeformData = { items: TypeformDataItem[] };
