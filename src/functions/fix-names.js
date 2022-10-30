import { nameFixes } from "../data/name-fixes.js";

export const fixName = ({ name }) => {
  let fixedName = "";

  fixedName = nameFixes[name] || name;

  return fixedName;
};
