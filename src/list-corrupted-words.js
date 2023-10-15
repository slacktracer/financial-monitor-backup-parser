/* eslint no-control-regex: "off" */
import { readBackupFiles } from "./functions/read-backup-files.js";
import util from "util";
import fs from "fs";

const [directory] = process.argv.slice(2);

(async ({ directory }) => {
  const { operations, transfers } = await readBackupFiles({ directory });

  const corruptedWordsWithExamples = {};

  operations.forEach((operation) => {
    const categoryHasCorruptedWord = operation.Category.match(
      /[a-zA-Z]*[]+[a-zA-Z]*/,
    );

    if (categoryHasCorruptedWord) {
      const [corruptedWord] = categoryHasCorruptedWord;

      if (!corruptedWordsWithExamples[corruptedWord]) {
        corruptedWordsWithExamples[corruptedWord] = [];
      }

      if (
        !corruptedWordsWithExamples[corruptedWord].includes(operation.Category)
      ) {
        corruptedWordsWithExamples[corruptedWord].push(operation.Category);
      }
    }

    const categoryGroupHasCorruptedWord = operation["Category group"].match(
      /[a-zA-Z]*[]+[a-zA-Z]*/,
    );

    if (categoryGroupHasCorruptedWord) {
      const [corruptedWord] = categoryGroupHasCorruptedWord;

      if (!corruptedWordsWithExamples[corruptedWord]) {
        corruptedWordsWithExamples[corruptedWord] = [];
      }

      if (
        !corruptedWordsWithExamples[corruptedWord].includes(
          operation["Category group"],
        )
      ) {
        corruptedWordsWithExamples[corruptedWord].push(
          operation["Category group"],
        );
      }
    }

    const commentHasCorruptedWord = operation.Comments.match(
      /[a-zA-Z]*[]+[a-zA-Z]*/,
    );

    if (commentHasCorruptedWord) {
      const [corruptedWord] = commentHasCorruptedWord;

      if (!corruptedWordsWithExamples[corruptedWord]) {
        corruptedWordsWithExamples[corruptedWord] = [];
      }

      if (
        !corruptedWordsWithExamples[corruptedWord].includes(operation.Comments)
      ) {
        corruptedWordsWithExamples[corruptedWord].push(operation.Comments);
      }
    }
  });

  transfers.forEach((transfer) => {
    const commentHasCorruptedWord = transfer.Comments.match(
      /[a-zA-Z]*[]+[a-zA-Z]*/,
    );

    if (commentHasCorruptedWord) {
      const [corruptedWord] = commentHasCorruptedWord;

      if (!corruptedWordsWithExamples[corruptedWord]) {
        corruptedWordsWithExamples[corruptedWord] = [];
      }

      if (
        !corruptedWordsWithExamples[corruptedWord].includes(transfer.Comments)
      ) {
        corruptedWordsWithExamples[corruptedWord].push(transfer.Comments);
      }
    }

    const fromAccountHasCorruptedWord = transfer["From account"].match(
      /[a-zA-Z]*[]+[a-zA-Z]*/,
    );

    if (fromAccountHasCorruptedWord) {
      const [corruptedWord] = fromAccountHasCorruptedWord;

      if (!corruptedWordsWithExamples[corruptedWord]) {
        corruptedWordsWithExamples[corruptedWord] = [];
      }

      if (
        !corruptedWordsWithExamples[corruptedWord].includes(
          transfer["From account"],
        )
      ) {
        corruptedWordsWithExamples[corruptedWord].push(
          transfer["From account"],
        );
      }
    }

    const toAccountHasCorruptedWord = transfer["To account"].match(
      /[a-zA-Z]*[]+[a-zA-Z]*/,
    );

    if (toAccountHasCorruptedWord) {
      const [corruptedWord] = toAccountHasCorruptedWord;

      if (!corruptedWordsWithExamples[corruptedWord]) {
        corruptedWordsWithExamples[corruptedWord] = [];
      }

      if (
        !corruptedWordsWithExamples[corruptedWord].includes(
          transfer["To account"],
        )
      ) {
        corruptedWordsWithExamples[corruptedWord].push(transfer["To account"]);
      }
    }
  });

  const corruptedWordsWithExamplesAsString = Object.entries(
    corruptedWordsWithExamples,
  )
    .sort(([wordA], [wordB]) => wordA.localeCompare(wordB))
    .map((a) => [a[0], "   ==>   " + a[1].join(" | ")])
    .join("\n");

  const writeFile = util.promisify(fs.writeFile);

  await writeFile(
    directory + "corrupted-words-with-examples.txt",
    corruptedWordsWithExamplesAsString,
  );

  const corruptedWordsWithExamplesInNameFixesFormat = Object.entries(
    corruptedWordsWithExamples,
  )
    .sort(([wordA], [wordB]) => wordA.localeCompare(wordB))
    .map(([a]) => `"${a}": "<todo>",`)
    .join("\n");

  await writeFile(
    directory + "corrupted-words-with-examples-in-name-fixes-format.txt",
    corruptedWordsWithExamplesInNameFixesFormat,
  );
})({ directory });
