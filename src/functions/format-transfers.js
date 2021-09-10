import { getTime, parse } from "date-fns";
import { v4 as uuidv4 } from "uuid";

import { fixName } from "./fix-names.js";
import { makeGetAccountIDByName } from "./make-get-account-id-by-name.js";
import { parseAmount } from "./parse-amount.js";

export const formatTransfers = ({ formattedAccounts, transfers }) => {
  const formattedTransfers = [];

  const getAccountIDByName = makeGetAccountIDByName({ formattedAccounts });

  for (const transfer of transfers) {
    const [
      datetime,
      type,
      fromAccount,
      toAccount,
      currency,
      ,
      amount,
      ,
      rate,
      comments,
    ] = Object.values(transfer);

    const [date, time] = datetime.split(" ");

    const datepath = date.split(".").reverse();

    const timestamp = getTime(parse(datetime, "dd.MM.yy HH:mm", new Date()));

    const fromAccountName = fixName({ name: fromAccount, type: "account" });

    const toAccountName = fixName({ name: toAccount, type: "account" });

    formattedTransfers.push({
      amount: parseAmount({ amount }),
      comments,
      currency: currency.replace(/^r$/, "R$"),
      fromAccountName,
      fromAccountID: getAccountIDByName({ accountName: fromAccountName }),
      transferID: uuidv4(),
      rate,
      timestamp,
      toAccountName,
      toAccountID: getAccountIDByName({ accountName: toAccountName }),
      type,
      __meta__: { datepath, time },
    });
  }

  return formattedTransfers;
};
