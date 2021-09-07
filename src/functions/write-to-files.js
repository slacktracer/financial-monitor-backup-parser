import fs from "fs";
import util from "util";

export const writeToFiles = ({ configuration, directory }) => {
  const stringify = (value) => JSON.stringify(value, null, 2);

  const writeFile = util.promisify(fs.writeFile);

  return Promise.all(
    configuration.map(({ data, filename }) =>
      writeFile(directory + filename, stringify(data)),
    ),
  );
};
