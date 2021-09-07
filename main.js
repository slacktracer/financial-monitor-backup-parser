import fs from "fs";
import util from "util";

import { formatOperations } from "./functions/format-operations.js";
import { getGroupsAndCategories } from "./functions/get-groups-and categories.js";
import { readBackupFiles } from "./functions/read-backup-files.js";

const [directory] = process.argv.slice(2);

(async ({ directory }) => {
  const { operations } = await readBackupFiles({ directory });

  const groupsAndCategories = getGroupsAndCategories({ operations });

  const formattedOperations = formatOperations({ operations });

  const writeFile = util.promisify(fs.writeFile);

  await writeFile(
    directory + "groupsAndCategories.json",
    JSON.stringify(groupsAndCategories, null, 2),
  );
  await writeFile(
    directory + "operations.json",
    JSON.stringify(formattedOperations, null, 2),
  );
})({ directory });
