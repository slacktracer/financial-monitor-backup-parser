import fs from "fs";
import util from "util";

export const outputSQL = ({
  directory,
  formattedAccounts,
  formattedGroupsAndCategories,
  formattedOperations,
  formattedTransfers,
  userID,
}) => {
  const accounts = formattedAccounts
    .map(
      ({ accountID, initialAmount, name }) =>
        `INSERT INTO public.account(account_id, created_at, created_at_timezone, initial_amount, name, user_id) VALUES ('${accountID}', NOW(), 'America/Belem', ${initialAmount}, '${name}', '${userID}');`,
    )
    .join("\n");

  const transfers = formattedTransfers
    .map(
      ({
        amount,
        comments,
        fromAccountID,
        timestamp,
        toAccountID,
        transferID,
      }) =>
        `INSERT INTO public.transfer(amount, at, at_timezone, comments, created_at, created_at_timezone, from_account_id, to_account_id, transfer_id, user_id) VALUES (${amount}, to_timestamp(${timestamp}), 'America/Belem', '${comments.replace(
          /'/g,
          "''",
        )}', NOW(), 'America/Belem', '${fromAccountID}', '${toAccountID}', '${transferID}', '${userID}');`,
    )
    .join("\n");

  const groups = formattedGroupsAndCategories.groups
    .map(
      ({ groupID, name }) =>
        `INSERT INTO public.group(created_at, created_at_timezone, group_id, name, user_id) VALUES (NOW(), 'America/Belem', '${groupID}', '${name.replace(
          /'/g,
          "''",
        )}', '${userID}');`,
    )
    .join("\n");

  const categories = formattedGroupsAndCategories.categories
    .map(
      ({ categoryID, groupID, name }) =>
        `INSERT INTO public.category(category_id, created_at, created_at_timezone, group_id, name, user_id) VALUES ('${categoryID}', NOW(), 'America/Belem', '${groupID}', '${name.replace(
          /'/g,
          "''",
        )}', '${userID}');`,
    )
    .join("\n");

  const operations = formattedOperations
    .map(
      ({
        accountID,
        amount,
        amountPerUnit,
        categoryID,
        comments,
        operationID,
        tags,
        timestamp,
        type,
        unitCount,
      }) =>
        `INSERT INTO public.operation(account_id, amount, amount_per_unit, at, at_timezone, category_id, comments, created_at, created_at_timezone, operation_id, tags, type, unit_count, user_id) VALUES ('${accountID}', ${amount}, ${amountPerUnit}, to_timestamp(${timestamp}), 'America/Belem', '${categoryID}', '${comments.replace(
          /'/g,
          "''",
        )}', NOW(), 'America/Belem', '${operationID}', '${JSON.stringify(
          tags,
        )}', '${type}', ${unitCount}, '${userID}');`,
    )
    .join("\n");

  const filename = "all-inserts.sql";

  const string = `${accounts}\n${transfers}\n${groups}\n${categories}\n${operations}`;

  const writeFile = util.promisify(fs.writeFile);

  return writeFile(directory + filename, string);
};
