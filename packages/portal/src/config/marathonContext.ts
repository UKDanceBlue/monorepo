import { createContext, useContext } from "react";

import type { DateTime } from "luxon";

export const marathonContext = createContext<{
  setMarathon: (marathonId: string | null) => void;
  marathon: {
    id: string;
    year: string;
    startDate: DateTime | null;
    endDate: DateTime | null;
  } | null;
  marathons:
    | readonly {
        id: string;
        year: string;
      }[]
    | null;
  loading: boolean;
}>({
  setMarathon: () => {},
  marathon: null,
  marathons: [],
  loading: true,
});

export const useMarathon = () => {
  const { marathon } = useContext(marathonContext);
  return marathon;
};
