import { writeToFiles } from "./write-to-files.js";

export const outputJSON = ({
  directory,
  formattedAccounts,
  formattedOperations,
  formattedTagKeysAndValues,
  formattedTransfers,
}) => {
  const configuration = [
    { data: formattedAccounts, filename: "accounts.json" },
    { data: formattedTagKeysAndValues, filename: "tags.json" },
    { data: formattedOperations, filename: "operations.json" },
    { data: formattedTransfers, filename: "transfers.json" },
  ];

  return writeToFiles({ configuration, directory });
};
