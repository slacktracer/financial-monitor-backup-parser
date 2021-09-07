import { getTime, parse } from "date-fns";
import { v4 as uuidv4 } from "uuid";

import { parseAmount } from "./parse-amount.js";

export const formatTransfers = ({ transfers }) => {
  const formattedTransfers = [];

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

    formattedTransfers.push({
      amount: parseAmount({ amount }),
      comments,
      currency: currency.replace(/^r$/, "R$"),
      fromAccount,
      id: uuidv4(),
      rate,
      timestamp,
      toAccount,
      type,
      __meta__: { datepath, time },
    });
  }

  return formattedTransfers;
};
