import { getTime, parse } from "date-fns";
import { v4 as uuidv4 } from "uuid";

import { fixName } from "./fix-names.js";
import { makeGetAccountIDByName } from "./make-get-account-id-by-name.js";
import { parseAmount } from "./parse-amount.js";

export const formatOperations = ({
  formattedAccounts,
  formattedTagKeysAndValues,
  operations,
}) => {
  const formattedOperationsData = [];

  const getAccountIDByName = makeGetAccountIDByName({ formattedAccounts });

  const getTagKeyID = ({ tagKeyName }) =>
    formattedTagKeysAndValues.keys.find((tagKey) => tagKey.name === tagKeyName)
      .tagKeyID;

  const getTagValueID = ({ tagValueName }) =>
    formattedTagKeysAndValues.values.find(
      (tagValue) => tagValue.name === tagValueName,
    ).tagValueID;

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

    const groupName = fixName({ name: group });

    formattedOperationsData.push({
      accountID: getAccountIDByName({ accountName }),
      accountName,
      amount: parseAmount({ amount }),
      amountPerUnit: parseAmount({ amount: amountPerUnit }),
      comments,
      categoryName,
      currency: currency.replace(/^r$/, "R$"),
      groupName,
      operationID: uuidv4(),
      tags: {
        [getTagKeyID({ tagKeyName: "Category" })]: getTagValueID({
          tagValueName: categoryName,
        }),
        [getTagKeyID({ tagKeyName: "Group" })]: getTagValueID({
          tagValueName: groupName,
        }),
      },
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
