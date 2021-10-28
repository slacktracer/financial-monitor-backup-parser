import fs from "fs";
import util from "util";

export const outputSQL = ({
  directory,
  formattedAccounts,
  formattedCategories,
  formattedGroups,
  formattedOperations,
  formattedTransfers,
}) => {
  const accounts = formattedAccounts
    .map(
      ({ accountID, initialAmount, name }) =>
        `INSERT INTO public.account(account_id, initial_amount, name) VALUES ('${accountID}', ${initialAmount}, '${name}');`,
    )
    .join("\n");

  const categories = formattedCategories
    .map(
      ({ categoryID, groupID, name }) =>
        `INSERT INTO public.category(category_id, name, group_id) VALUES ('${categoryID}', '${name.replace(
          /'/g,
          "''",
        )}', '${groupID}');`,
    )
    .join("\n");

  const groups = formattedGroups
    .map(
      ({ groupID, name }) =>
        `INSERT INTO public.group(group_id, name) VALUES ('${groupID}', '${name}');`,
    )
    .join("\n");

  const transfers = formattedTransfers
    .map(
      ({ amount, fromAccountID, transferID, timestamp, toAccountID }) =>
        `INSERT INTO public.transfer(amount, at, from_account_id, transfer_id, to_account_id) VALUES (${amount}, to_timestamp(${timestamp}), '${fromAccountID}', '${transferID}', '${toAccountID}');`,
    )
    .join("\n");

  const operations = formattedOperations
    .map(
      ({
        accountID,
        amount,
        amountPerUnit,
        comments,
        categoryID,
        groupID,
        operationID,
        timestamp,
        type,
        unitCount,
      }) =>
        `INSERT INTO public.operation(account_id, amount, amount_per_unit, at, comments, category_id, group_id, operation_id, type, unit_count) VALUES ('${accountID}', ${amount}, ${amountPerUnit}, to_timestamp(${timestamp}), '${comments.replace(
          /'/g,
          "''",
        )}', '${categoryID}', '${groupID}', '${operationID}', '${type}', ${unitCount});`,
    )
    .join("\n");

  const filename = "all-inserts.sql";

  const string = `${accounts}\n${groups}\n${categories}\n${transfers}\n${operations}`;

  const writeFile = util.promisify(fs.writeFile);

  return writeFile(directory + filename, string);
};
