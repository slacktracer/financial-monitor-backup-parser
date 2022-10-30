import { writeToFiles } from "./write-to-files.js";

export const outputJSON = ({
  directory,
  formattedAccounts,
  formattedOperations,
  formattedTags,
  formattedTransfers,
}) => {
  const configuration = [
    { data: formattedAccounts, filename: "accounts.json" },
    { data: formattedTags, filename: "tags.json" },
    { data: formattedOperations, filename: "operations.json" },
    { data: formattedTransfers, filename: "transfers.json" },
  ];

  return writeToFiles({ configuration, directory });
};
