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
        `INSERT INTO public.accounts(account_id, initial_amount, name) VALUES ('${accountID}', ${initialAmount}, '${name}');`,
    )
    .join("\n");

  const categories = formattedCategories
    .map(
      ({ categoryID, groupID, name }) =>
        `INSERT INTO public.categories(category_id, name, group_id) VALUES ('${categoryID}', '${name}', '${groupID}');`,
    )
    .join("\n");

  const groups = formattedGroups
    .map(
      ({ groupID, name }) =>
        `INSERT INTO public.groups(group_id, name) VALUES ('${groupID}', '${name}');`,
    )
    .join("\n");

  const transfers = formattedTransfers
    .map(
      ({
        amount,
        comments,
        currency,
        fromAccountID,
        transferID,
        timestamp,
        toAccountID,
        type,
      }) =>
        `INSERT INTO public.transfers(amount, comments, currency, from_account_id, transfer_id, "timestamp", to_account_id, type) VALUES (${amount}, '${comments.replace(
          /'/g,
          "''",
        )}', '${currency}', '${fromAccountID}', '${transferID}', to_timestamp(${timestamp}), '${toAccountID}', '${type}');`,
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
        currency,
        groupID,
        operationID,
        timestamp,
        type,
        unitCount,
      }) =>
        `INSERT INTO public.operations(account_id, amount, amount_per_unit, comments, category_id, currency, group_id, operation_id, "timestamp", type, unit_count) VALUES ('${accountID}', ${amount}, ${amountPerUnit}, '${comments.replace(
          /'/g,
          "''",
        )}', '${categoryID}', '${currency}', '${groupID}', '${operationID}', to_timestamp(${timestamp}), '${type}', ${unitCount});`,
    )
    .join("\n");

  const filename = "all-inserts.sql";

  const string = `${accounts}\n${groups}\n${categories}\n${transfers}\n${operations}`;

  const writeFile = util.promisify(fs.writeFile);

  return writeFile(directory + filename, string);
};
