import { getTime, parse } from "date-fns";
import { v4 as uuid } from "uuid";

import { fixName } from "./fix-names.js";
import { makeGetAccountIDByName } from "./make-get-account-id-by-name.js";
import { parseAmount } from "./parse-amount.js";

export const formatOperations = ({
  formattedAccounts,
  formattedGroupsAndCategories,
  operations,
}) => {
  const formattedOperationsData = [];

  const getAccountIDByName = makeGetAccountIDByName({ formattedAccounts });

  for (const operation of operations) {
    const [
      datetime,
      type,
      account,
      group,
      category,
      currency,
      amountPerUnit,
      unitCount,
      amount,
      comments,
    ] = Object.values(operation);

    const [date, time] = datetime.split(" ");

    const datepath = date.split(".").reverse();

    const timestamp =
      getTime(parse(datetime, "dd.MM.yy HH:mm", new Date())) / 1000;

    const accountName = fixName({ name: account });

    const categoryName = fixName({ name: category });

    const categoryID = formattedGroupsAndCategories.categories.find(
      (category) => category.name === categoryName,
    )?.categoryID;

    const groupName = fixName({ name: group });

    formattedOperationsData.push({
      accountID: getAccountIDByName({ accountName }),
      accountName,
      amount: parseAmount({ amount }),
      amountPerUnit: parseAmount({ amount: amountPerUnit }),
      comments,
      categoryID,
      categoryName,
      currency: currency.replace(/^r$/, "R$"),
      groupName,
      operationID: uuid(),
      tags: {},
      timestamp,
      type,
      unitCount: Number(unitCount),
      __meta__: { datepath, time },
    });
  }

  return formattedOperationsData.sort(
    (operationA, operationB) => operationA.timestamp - operationB.timestamp,
  );
};
