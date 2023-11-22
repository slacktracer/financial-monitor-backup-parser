import { accountNameFixes } from "../data/account-name-fixes.js";
import { categoryNameFixes } from "../data/category-name-fixes.js";
import { groupNameFixes } from "../data/group-name-fixes.js";

export const fixName = ({ name, type }) => {
  let fixedName = "";

  if (type === "account") {
    fixedName = accountNameFixes[name] || name;
  }

  if (type === "category") {
    fixedName = categoryNameFixes[name] || name;
  }

  if (type === "group") {
    fixedName = groupNameFixes[name] || name;
  }

  return fixedName;
};
