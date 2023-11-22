/* eslint no-control-regex: "off" */
import fs from "fs";
import util from "util";

import { accountNameFixes } from "./data/account-name-fixes.js";
import { categoryNameFixes } from "./data/category-name-fixes.js";
import { groupNameFixes } from "./data/group-name-fixes.js";
import { readBackupFiles } from "./functions/read-backup-files.js";

const corruptedStringRegex = /[a-zA-Z]*[]+[a-zA-Z]*/;

const [directory] = process.argv.slice(2);

(async ({ directory }) => {
  const { operations, transfers } = await readBackupFiles({ directory });

  const corruptedAccounts = [];

  const corruptedCategories = [];

  const corruptedGroups = [];

  operations.forEach((operation) => {
    const accountHasCorruptedWord =
      operation.Account.match(corruptedStringRegex);

    if (accountHasCorruptedWord) {
      corruptedAccounts.push(operation.Account);
    }

    const categoryHasCorruptedWord =
      operation.Category.match(corruptedStringRegex);

    if (categoryHasCorruptedWord) {
      corruptedCategories.push(operation.Category);
    }

    const groupHasCorruptedWord =
      operation["Category group"].match(corruptedStringRegex);

    if (groupHasCorruptedWord) {
      corruptedGroups.push(operation["Category group"]);
    }
  });

  transfers.forEach((transfer) => {
    const fromAccountHasCorruptedWord =
      transfer["From account"].match(corruptedStringRegex);

    if (fromAccountHasCorruptedWord) {
      corruptedAccounts.push(transfer["From account"]);
    }

    const toAccountHasCorruptedWord =
      transfer["To account"].match(corruptedStringRegex);

    if (toAccountHasCorruptedWord) {
      corruptedAccounts.push(transfer["To account"]);
    }
  });

  const updatedAccountNameFixes = Array.from(new Set(corruptedAccounts))
    .sort((wordA, wordB) => wordA.localeCompare(wordB))
    .map((word) => `  "${word}": "${accountNameFixes[word] ?? "<todo>"}",`)
    .join("\n");

  const updatedCategoryNameFixes = Array.from(new Set(corruptedCategories))
    .sort((wordA, wordB) => wordA.localeCompare(wordB))
    .map((word) => `  "${word}": "${categoryNameFixes[word] ?? "<todo>"}",`)
    .join("\n");

  const updatedGroupNameFixes = Array.from(new Set(corruptedGroups))
    .sort((wordA, wordB) => wordA.localeCompare(wordB))
    .map((word) => `  "${word}": "${groupNameFixes[word] ?? "<todo>"}",`)
    .join("\n");

  const accountNameFixesConst = `export const accountNameFixes = {
${updatedAccountNameFixes}
};`;

  const categoryNameFixesConst = `export const categoryNameFixes = {
${updatedCategoryNameFixes}
};`;

  const groupNameFixesConst = `export const groupNameFixes = {
${updatedGroupNameFixes}
};`;

  const writeFile = util.promisify(fs.writeFile);

  await writeFile("./src/data/account-name-fixes.js", accountNameFixesConst);

  await writeFile("./src/data/category-name-fixes.js", categoryNameFixesConst);

  await writeFile("./src/data/group-name-fixes.js", groupNameFixesConst);
})({ directory });
