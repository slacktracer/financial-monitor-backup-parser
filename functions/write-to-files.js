import fs from "fs";
import util from "util";

export const writeToFiles = ({ configuration, directory }) => {
  const stringify = (value) => JSON.stringify(value, null, 2);

  const writeFile = util.promisify(fs.writeFile);

  return configuration.map(({ data, filename }) =>
    writeFile(directory + filename, stringify(data)),
  );
};
