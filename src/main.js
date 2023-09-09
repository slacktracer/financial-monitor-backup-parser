import { formatAccounts } from "./functions/format-accounts.js";
import { formatOperations } from "./functions/format-operations.js";
import { formatTransfers } from "./functions/format-transfers.js";
import { getGroupsAndCategories } from "./functions/get-groups-and categories.js";
import { outputJSON } from "./functions/output-json.js";
import { outputSQL } from "./functions/output-sql.js";
import { readBackupFiles } from "./functions/read-backup-files.js";
import { formatGroupsAndCategories } from "./functions/format-groups-and-categories.js";

const [output, directory, userID] = process.argv.slice(2);

(async ({ directory, output, userID }) => {
  const { operations, transfers } = await readBackupFiles({ directory });

  const formattedAccounts = formatAccounts({ operations, transfers });

  const groupsAndCategories = getGroupsAndCategories({ operations });

  const formattedGroupsAndCategories = formatGroupsAndCategories({
    groupsAndCategories,
  });

  const formattedOperations = formatOperations({
    formattedAccounts,
    formattedGroupsAndCategories,
    operations,
  });

  const formattedTransfers = formatTransfers({ formattedAccounts, transfers });

  if (output === "JSON") {
    await outputJSON({
      directory,
      formattedAccounts,
      formattedOperations,
      formattedTransfers,
    });
  }

  if (output === "SQL") {
    await outputSQL({
      directory,
      formattedAccounts,
      formattedGroupsAndCategories,
      formattedOperations,
      formattedTransfers,
      userID,
    });
  }
})({ directory, output, userID });
