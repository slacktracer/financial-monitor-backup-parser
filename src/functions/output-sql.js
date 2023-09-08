import fs from "fs";
import util from "util";

export const outputSQL = ({
  directory,
  formattedAccounts,
  formattedOperations,
  formattedTransfers,
  userID,
}) => {
  const accounts = formattedAccounts
    .map(
      ({ accountID, initialAmount, name }) =>
        `INSERT INTO public.account(account_id, created_at, initial_amount, name, user_id) VALUES ('${accountID}', NOW(), ${initialAmount}, '${name}', '${userID}');`,
    )
    .join("\n");

  const transfers = formattedTransfers
    .map(
      ({ amount, fromAccountID, timestamp, toAccountID, transferID }) =>
        `INSERT INTO public.transfer(amount, at, created_at, from_account_id, to_account_id, transfer_id, user_id) VALUES (${amount}, to_timestamp(${timestamp}), NOW(), '${fromAccountID}', '${toAccountID}', '${transferID}', '${userID}');`,
    )
    .join("\n");

  const operations = formattedOperations
    .map(
      ({
        accountID,
        amount,
        amountPerUnit,
        comments,
        operationID,
        tags,
        timestamp,
        type,
        unitCount,
      }) =>
        `INSERT INTO public.operation(account_id, amount, amount_per_unit, at, comments, created_at, operation_id, tags, type, unit_count, user_id) VALUES ('${accountID}', ${amount}, ${amountPerUnit}, to_timestamp(${timestamp}), '${comments.replace(
          /'/g,
          "''",
        )}', NOW(), '${operationID}', '${JSON.stringify(
          tags,
        )}', '${type}', ${unitCount}, '${userID}');`,
    )
    .join("\n");

  const filename = "all-inserts.sql";

  const string = `${accounts}\n${transfers}\n${operations}`;

  const writeFile = util.promisify(fs.writeFile);

  return writeFile(directory + filename, string);
};
