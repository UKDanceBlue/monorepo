import type { DateTime } from "luxon";
import { createContext, useContext } from "react";

export interface MarathonContextData {
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
  source?: "latest" | "selected";
}

// TODO replace marathon and setMarathon with Router context and move marathons to a simple hook
export const marathonContext = createContext<MarathonContextData>({
  setMarathon: () => undefined,
  marathon: null,
  marathons: [],
  loading: true,
});

export const useMarathon = () => {
  const { marathon } = useContext(marathonContext);
  return marathon;
};
