import { v4 as uuid } from "uuid";

export const formatTagKeysAndValues = ({ groupsAndCategories }) => {
  const categoryTagKeyID = uuid();
  const groupTagKeyID = uuid();

  const keys = [
    {
      tagKeyID: categoryTagKeyID,
      name: "Category",
    },
    {
      tagKeyID: groupTagKeyID,
      name: "Group",
    },
  ];

  const allGroupsAndCategories = [
    ...new Set(
      Object.entries(groupsAndCategories)
        .flat(2)
        .sort((a, b) => a.localeCompare(b)),
    ),
  ];

  const values = allGroupsAndCategories.map((value) => ({
    tagValueID: uuid(),
    name: value,
  }));

  return { keys, values };
};
