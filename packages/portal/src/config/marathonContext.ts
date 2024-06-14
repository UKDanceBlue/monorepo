import type { DateTime } from "luxon";
import { createContext, useContext } from "react";

export const marathonContext = createContext<{
  setMarathon: (marathonId: string | null) => void;
  marathon: {
    id: string;
    year: string;
    startDate: DateTime | null;
    endDate: DateTime | null;
  } | null;
}>({
  setMarathon: () => {},
  marathon: null,
});

export const useMarathon = () => {
  const { marathon } = useContext(marathonContext);
  return marathon;
};
