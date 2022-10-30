import fs from "fs";
import util from "util";

export const outputSQL = ({
  directory,
  formattedAccounts,
  formattedOperations,
  formattedTags,
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
        timestamp,
        type,
        unitCount,
      }) =>
        `INSERT INTO public.operation(account_id, amount, amount_per_unit, at, comments, created_at, operation_id, type, unit_count, user_id) VALUES ('${accountID}', ${amount}, ${amountPerUnit}, to_timestamp(${timestamp}), '${comments.replace(
          /'/g,
          "''",
        )}', NOW(), '${operationID}', '${type}', ${unitCount}, '${userID}');`,
    )
    .join("\n");

  const tagKeys = formattedTags.tagKeys
    .map(
      ({ tagKeyID, name }) =>
        `INSERT INTO public.tag_key(created_at, tag_key_id, name, user_id) VALUES (NOW(), '${tagKeyID}', '${name}', '${userID}');`,
    )
    .join("\n");

  const tagValues = formattedTags.tagValues
    .map(
      ({ tagValueID, name }) =>
        `INSERT INTO public.tag_value(created_at, tag_value_id, name, user_id) VALUES (NOW(), '${tagValueID}', '${name.replace(
          /'/g,
          "''",
        )}', '${userID}');`,
    )
    .join("\n");

  const tags = formattedTags.tags
    .map(
      ({ operationID, tagID, tagKeyID, tagValueID }) =>
        `INSERT INTO public.tag(created_at, operation_id, tag_id, tag_key_id, tag_value_id, user_id) VALUES (NOW(), '${operationID}', '${tagID}', '${tagKeyID}', '${tagValueID}', '${userID}');`,
    )
    .join("\n");

  const filename = "all-inserts.sql";

  const string = `${accounts}\n${transfers}\n${operations}\n${tagKeys}\n${tagValues}\n${tags}`;

  const writeFile = util.promisify(fs.writeFile);

  return writeFile(directory + filename, string);
};
