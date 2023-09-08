import { v4 as uuid } from "uuid";

export const formatGroupsAndCategories = ({ groupsAndCategories }) => {
  const categories = [];

  const groups = [];

  for (const groupAndCategories of Object.entries(groupsAndCategories)) {
    const [group, groupCategories] = groupAndCategories;

    const groupID = uuid();

    groups.push({
      groupID,
      name: group,
    });

    for (const category of groupCategories) {
      categories.push({
        categoryID: uuid(),
        groupID,
        name: category,
      });
    }
  }

  return { categories, groups };
};
