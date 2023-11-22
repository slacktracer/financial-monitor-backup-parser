/* eslint no-control-regex: "off" */
import fs from "fs";
import util from "util";

import { corruptedWordsInCommentsFixes } from "./data/corrupted-words-in-comments-fixes.js";
import { readBackupFiles } from "./functions/read-backup-files.js";

const corruptedStringRegex = /[a-zA-Z]*[]+[a-zA-Z]*/;

const [directory] = process.argv.slice(2);

(async ({ directory }) => {
  const { operations, transfers } = await readBackupFiles({ directory });

  const corruptedWordsInComments = {};

  operations.forEach((operation) => {
    const commentHasCorruptedWord =
      operation.Comments.match(corruptedStringRegex);

    if (commentHasCorruptedWord) {
      const [corruptedWord] = commentHasCorruptedWord;

      if (!corruptedWordsInComments[corruptedWord]) {
        corruptedWordsInComments[corruptedWord] = [];
      }

      if (
        !corruptedWordsInComments[corruptedWord].includes(operation.Comments)
      ) {
        corruptedWordsInComments[corruptedWord].push(operation.Comments);
      }
    }
  });

  transfers.forEach((transfer) => {
    const commentHasCorruptedWord =
      transfer.Comments.match(corruptedStringRegex);

    if (commentHasCorruptedWord) {
      const [corruptedWord] = commentHasCorruptedWord;

      if (!corruptedWordsInComments[corruptedWord]) {
        corruptedWordsInComments[corruptedWord] = [];
      }

      if (
        !corruptedWordsInComments[corruptedWord].includes(transfer.Comments)
      ) {
        corruptedWordsInComments[corruptedWord].push(transfer.Comments);
      }
    }
  });

  const writeFile = util.promisify(fs.writeFile);

  const corruptedWordsInCommentsWithExamples = Object.entries(
    corruptedWordsInComments,
  )
    .sort(([wordA], [wordB]) => wordA.localeCompare(wordB))
    .map(
      ([word, examples]) =>
        `  "${word}": "${corruptedWordsInCommentsFixes[word] ?? "<todo>"}", ${
          corruptedWordsInCommentsFixes[word] === undefined ||
          (corruptedWordsInCommentsFixes[word] &&
            corruptedWordsInCommentsFixes[word] === "<todo>")
            ? `// ${examples}`
            : ""
        }`,
    )
    .join("\n");

  const corruptedWordsInCommentsFixesConst = `export const corruptedWordsInCommentsFixes = {
${corruptedWordsInCommentsWithExamples}
};`;

  await writeFile(
    "./src/data/corrupted-words-in-comments-fixes.js",
    corruptedWordsInCommentsFixesConst,
  );
})({ directory });
