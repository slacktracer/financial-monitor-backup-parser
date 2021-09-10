import { formatGroupsAndCategories } from "./functions/format-groups-and-categories.js";
import { formatOperations } from "./functions/format-operations.js";
import { formatTransfers } from "./functions/format-transfers.js";
import { getGroupsAndCategories } from "./functions/get-groups-and categories.js";
import { readBackupFiles } from "./functions/read-backup-files.js";
import { writeToFiles } from "./functions/write-to-files.js";

const [directory] = process.argv.slice(2);

(async ({ directory }) => {
  const { operations, transfers } = await readBackupFiles({ directory });

  const groupsAndCategories = getGroupsAndCategories({ operations });

  const { formattedGroups, formattedCategories } = formatGroupsAndCategories({
    groupsAndCategories,
  });

  const formattedOperations = formatOperations({
    formattedCategories,
    formattedGroups,
    operations,
  });

  const formattedTransfers = formatTransfers({ transfers });

  const configuration = [
    { data: formattedCategories, filename: "categories.json" },
    { data: formattedGroups, filename: "groups.json" },
    { data: formattedOperations, filename: "operations.json" },
    { data: formattedTransfers, filename: "transfers.json" },
  ];

  await writeToFiles({ configuration, directory });
})({ directory });
