import { nameFixes } from "../data/name-fixes.js";

export const fixName = ({ name, type }) => {
  let fixedName = "";

  fixedName = nameFixes[type][name] || name;

  return fixedName;
};
