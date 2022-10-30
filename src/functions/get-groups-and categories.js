import { fixName } from "./fix-names.js";

export const getGroupsAndCategories = ({ operations }) => {
  const groupsAndCategories = operations
    .reduce((reduction, operation) => {
      let [, , , group, category] = Object.values(operation);

      category = fixName({ name: category });
      group = fixName({ name: group });

      const existingGroupObject = reduction.find(
        (groupObject) => groupObject.name === group,
      );

      if (existingGroupObject) {
        existingGroupObject.categories.add(category);
      } else {
        const newGroupObject = { categories: new Set([category]), name: group };

        reduction.push(newGroupObject);
      }

      return reduction;
    }, [])
    .sort((groupA, groupB) => groupA.name.localeCompare(groupB.name))
    .map((group) => {
      group.categories = Array.from(group.categories).sort(
        (categoryA, categoryB) => categoryA.localeCompare(categoryB),
      );

      return group;
    })
    .reduce((reduction, group) => {
      reduction[group.name] = group.categories;

      return reduction;
    }, {});

  return groupsAndCategories;
};
