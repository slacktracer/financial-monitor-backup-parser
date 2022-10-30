import { formatAccounts } from "./functions/format-accounts.js";
import { formatOperations } from "./functions/format-operations.js";
import { formatTransfers } from "./functions/format-transfers.js";
import { getGroupsAndCategories } from "./functions/get-groups-and categories.js";
import { outputJSON } from "./functions/output-json.js";
import { outputSQL } from "./functions/output-sql.js";
import { readBackupFiles } from "./functions/read-backup-files.js";
import { formatTags } from "./functions/format-tags.js";

const [output, directory, userID] = process.argv.slice(2);

(async ({ directory, output, userID }) => {
  const { operations, transfers } = await readBackupFiles({ directory });

  const formattedAccounts = formatAccounts({ operations, transfers });

  const groupsAndCategories = getGroupsAndCategories({ operations });

  const formattedOperations = formatOperations({
    formattedAccounts,
    operations,
  });

  const formattedTransfers = formatTransfers({ formattedAccounts, transfers });

  const formattedTags = formatTags({
    formattedOperations,
    groupsAndCategories,
  });

  if (output === "JSON") {
    await outputJSON({
      directory,
      formattedAccounts,
      formattedOperations,
      formattedTags,
      formattedTransfers,
    });
  }

  if (output === "SQL") {
    await outputSQL({
      directory,
      formattedAccounts,
      formattedOperations,
      formattedTags,
      formattedTransfers,
      userID,
    });
  }
})({ directory, output, userID });
