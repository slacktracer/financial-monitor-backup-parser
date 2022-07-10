import { formatAccounts } from "./functions/format-accounts.js";
import { formatGroupsAndCategories } from "./functions/format-groups-and-categories.js";
import { formatOperations } from "./functions/format-operations.js";
import { formatTransfers } from "./functions/format-transfers.js";
import { formatUser } from "./functions/formatUser.js";
import { getGroupsAndCategories } from "./functions/get-groups-and categories.js";
import { outputJSON } from "./functions/output-json.js";
import { outputSQL } from "./functions/output-sql.js";
import { readBackupFiles } from "./functions/read-backup-files.js";

const [output, directory, user] = process.argv.slice(2);

(async ({ directory }) => {
  const formattedUser = formatUser({ user });

  const { operations, transfers } = await readBackupFiles({ directory });

  const formattedAccounts = formatAccounts({ operations, transfers });

  const groupsAndCategories = getGroupsAndCategories({ operations });

  const { formattedGroups, formattedCategories } = formatGroupsAndCategories({
    groupsAndCategories,
  });

  const formattedOperations = formatOperations({
    formattedAccounts,
    formattedCategories,
    formattedGroups,
    operations,
  });

  const formattedTransfers = formatTransfers({ formattedAccounts, transfers });

  if (output === "JSON") {
    await outputJSON({
      directory,
      formattedAccounts,
      formattedCategories,
      formattedGroups,
      formattedOperations,
      formattedTransfers,
    });
  }

  if (output === "SQL") {
    await outputSQL({
      directory,
      formattedAccounts,
      formattedCategories,
      formattedGroups,
      formattedOperations,
      formattedTransfers,
      formattedUser,
    });
  }
})({ directory });
