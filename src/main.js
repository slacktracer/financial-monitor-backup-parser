import { formatAccounts } from "./functions/format-accounts.js";
import { formatOperations } from "./functions/format-operations.js";
import { formatTransfers } from "./functions/format-transfers.js";
import { getGroupsAndCategories } from "./functions/get-groups-and categories.js";
import { outputJSON } from "./functions/output-json.js";
import { outputSQL } from "./functions/output-sql.js";
import { readBackupFiles } from "./functions/read-backup-files.js";
import { formatTagKeysAndValues } from "./functions/format-tag-keys-and-values.js";

const [output, directory, userID] = process.argv.slice(2);

(async ({ directory, output, userID }) => {
  const { operations, transfers } = await readBackupFiles({ directory });

  const formattedAccounts = formatAccounts({ operations, transfers });

  const groupsAndCategories = getGroupsAndCategories({ operations });

  const formattedTagKeysAndValues = formatTagKeysAndValues({
    groupsAndCategories,
  });

  const formattedOperations = formatOperations({
    formattedAccounts,
    formattedTagKeysAndValues,
    operations,
  });

  const formattedTransfers = formatTransfers({ formattedAccounts, transfers });

  if (output === "JSON") {
    await outputJSON({
      directory,
      formattedAccounts,
      formattedOperations,
      formattedTagKeysAndValues,
      formattedTransfers,
    });
  }

  if (output === "SQL") {
    await outputSQL({
      directory,
      formattedAccounts,
      formattedOperations,
      formattedTagKeysAndValues,
      formattedTransfers,
      userID,
    });
  }
})({ directory, output, userID });
