import { writeToFiles } from "./write-to-files.js";

export const outputJSON = ({
  directory,
  formattedAccounts,
  formattedCategories,
  formattedGroups,
  formattedOperations,
  formattedTransfers,
}) => {
  const configuration = [
    { data: formattedAccounts, filename: "accounts.json" },
    { data: formattedCategories, filename: "categories.json" },
    { data: formattedGroups, filename: "groups.json" },
    { data: formattedOperations, filename: "operations.json" },
    { data: formattedTransfers, filename: "transfers.json" },
  ];

  return writeToFiles({ configuration, directory });
};
