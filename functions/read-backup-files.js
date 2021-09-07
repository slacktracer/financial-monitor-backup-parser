import csvParser from "csv-parser";
import fs from "fs";
import util from "util";

export const readBackupFiles = async () => {
  const [directory] = process.argv.slice(2);

  const readDirectory = util.promisify(fs.readdir);

  const result = await readDirectory(directory);

  const backupFileNames = result.filter((fileName) =>
    fileName.startsWith("Report"),
  );

  const [operations, transfers] = (
    await Promise.all(
      backupFileNames.map(
        (backupFileName) =>
          new Promise((resolve) => {
            const fileContents = [];

            fs.createReadStream(directory + backupFileName)
              .pipe(csvParser({ separator: ";" }))
              .on("data", (data) => fileContents.push(data))
              .on("end", () => resolve(fileContents));
          }),
      ),
    )
  ).sort((a, b) => b.length - a.length);

  return { operations, transfers };
};
