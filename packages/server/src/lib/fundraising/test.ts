import { Container } from "@freshgum/typedi";
import { DBFundsFundraisingProvider } from "./DbFundsProvider.js";

const dbfunds = Container.get(DBFundsFundraisingProvider);

dbfunds
  .getTeams("DB24")
  .then((result) =>
    console.table(
      result.unwrap().sort(({ identifier: a }, { identifier: b }) => a - b)
    )
  )
  .catch(console.error);

dbfunds
  .getTeams("DB25")
  .then((result) =>
    console.table(
      result.unwrap().sort(({ identifier: a }, { identifier: b }) => a - b)
    )
  )
  .catch(console.error);
