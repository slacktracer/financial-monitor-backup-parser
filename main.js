import { readBackupFiles } from "./functions/read-backup-files.js";

(async () => {
  const { operations, transfers } = await readBackupFiles();

  console.log({ operations, transfers });
})();
