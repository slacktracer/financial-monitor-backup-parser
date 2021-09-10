import { v4 as uuid } from "uuid";

import { makeGetGroupIDByName } from "./make-get-group-id-by-name.js";

export const formatGroupsAndCategories = ({ groupsAndCategories }) => {
  const groupNames = Object.keys(groupsAndCategories);

  const formattedGroups = groupNames.map((groupName) => ({
    groupID: uuid(),
    name: groupName,
  }));

  const getGroupIDByName = makeGetGroupIDByName({ formattedGroups });

  const formattedCategories = groupNames
    .map((groupName) => {
      return groupsAndCategories[groupName].map((categoryName) => {
        return {
          categoryID: uuid(),
          groupID: getGroupIDByName({ groupName }),
          name: categoryName,
        };
      });
    })
    .flat()
    .sort((categoryA, categoryB) =>
      categoryA.name.localeCompare(categoryB.name),
    );

  return { formattedCategories, formattedGroups };
};
