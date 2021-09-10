import { v4 as uuid } from "uuid";

const makeGetGroupIDByName =
  ({ formattedGroups }) =>
  ({ groupName }) =>
    formattedGroups.find((group) => group.name === groupName).group_id;

export const formatGroupsAndCategories = ({ groupsAndCategories }) => {
  const groupNames = Object.keys(groupsAndCategories);

  const formattedGroups = groupNames.map((groupName) => ({
    group_id: uuid(),
    name: groupName,
  }));

  const getGroupIDByName = makeGetGroupIDByName({ formattedGroups });

  const formattedCategories = groupNames
    .map((groupName) => {
      return groupsAndCategories[groupName].map((categoryName) => {
        return {
          category_id: uuid(),
          group_id: getGroupIDByName({ groupName }),
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
