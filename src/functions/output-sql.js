export const outputSQL = ({
  formattedAccounts,
  formattedCategories,
  formattedGroups,
  formattedOperations,
}) => {
  const accounts = formattedAccounts
    .map(
      ({ accountID, name }) =>
        `INSERT INTO public.accounts(account_id, name) VALUES ('${accountID}', '${name}');`,
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
        `INSERT INTO public.operations(account_id, amount, amount_per_unit, comments, category_id, currency, group_id, operation_id, "timestamp", type, unit_count) VALUES ('${accountID}', '${amount}', '${amountPerUnit}', '${comments.replace(
          /'/g,
          "''",
        )}', '${categoryID}', '${currency}', '${groupID}', '${operationID}', to_timestamp(${timestamp}), '${type}', '${unitCount}');`,
    )
    .join("\n");

  console.log(accounts);
  console.log(categories);
  console.log(groups);
  console.log(operations);
};
