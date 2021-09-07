import fs from "fs";
import util from "util";

import { formatOperations } from "./functions/format-operations.js";
import { formatTransfers } from "./functions/format-transfers.js";
import { getGroupsAndCategories } from "./functions/get-groups-and categories.js";
import { readBackupFiles } from "./functions/read-backup-files.js";

const [directory] = process.argv.slice(2);

(async ({ directory }) => {
  const { operations, transfers } = await readBackupFiles({ directory });

  const groupsAndCategories = getGroupsAndCategories({ operations });

  const formattedOperations = formatOperations({ operations });

  const formattedTransfers = formatTransfers({ transfers });

  const writeFile = util.promisify(fs.writeFile);

  await writeFile(
    directory + "groupsAndCategories.json",
    JSON.stringify(groupsAndCategories, null, 2),
  );
  await writeFile(
    directory + "operations.json",
    JSON.stringify(formattedOperations, null, 2),
  );
  await writeFile(
    directory + "transfers.json",
    JSON.stringify(formattedTransfers, null, 2),
  );
})({ directory });
