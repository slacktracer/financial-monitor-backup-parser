import { getTime, parse } from "date-fns";
import { v4 as uuidv4 } from "uuid";

import { fixName } from "./fix-names.js";
import { makeGetAccountIDByName } from "./make-get-account-id-by-name.js";
import { makeGetCategoryIDByName } from "./make-get-category-id-by-name.js";
import { makeGetGroupIDByName } from "./make-get-group-id-by-name.js";
import { parseAmount } from "./parse-amount.js";

export const formatOperations = ({
  formattedAccounts,
  formattedCategories,
  formattedGroups,
  operations,
}) => {
  const formattedOperationsData = [];

  const getAccountIDByName = makeGetAccountIDByName({ formattedAccounts });

  const getCategoryIDByName = makeGetCategoryIDByName({ formattedCategories });

  const getGroupIDByName = makeGetGroupIDByName({ formattedGroups });

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

    const accountName = fixName({ name: account, type: "account" });

    const categoryName = fixName({ name: category, type: "category" });

    const groupName = fixName({ name: group, type: "group" });

    formattedOperationsData.push({
      accountID: getAccountIDByName({ accountName }),
      accountName,
      amount: parseAmount({ amount }),
      amountPerUnit: parseAmount({ amount: amountPerUnit }),
      comments,
      categoryID: getCategoryIDByName({ categoryName }),
      categoryName,
      currency: currency.replace(/^r$/, "R$"),
      groupID: getGroupIDByName({ groupName }),
      groupName,
      operationID: uuidv4(),
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
