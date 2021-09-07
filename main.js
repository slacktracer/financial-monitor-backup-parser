import { formatOperations } from "./functions/format-operations.js";
import { formatTransfers } from "./functions/format-transfers.js";
import { getGroupsAndCategories } from "./functions/get-groups-and categories.js";
import { readBackupFiles } from "./functions/read-backup-files.js";
import { writeToFiles } from "./functions/write-to-files.js";

const [directory] = process.argv.slice(2);

(async ({ directory }) => {
  const { operations, transfers } = await readBackupFiles({ directory });

  const groupsAndCategories = getGroupsAndCategories({ operations });

  const formattedOperations = formatOperations({ operations });

  const formattedTransfers = formatTransfers({ transfers });

  const configuration = [
    { data: groupsAndCategories, filename: "groups.json" },
    { data: formattedOperations, filename: "operations.json" },
    { data: formattedTransfers, filename: "transfers.json" },
  ];

  await writeToFiles({ configuration, directory });
})({ directory });
