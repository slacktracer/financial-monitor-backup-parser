import { v4 as uuidv4 } from "uuid";

export const formatTagKeysAndValues = ({ groupsAndCategories }) => {
  const categoryTagKeyID = uuidv4();
  const groupTagKeyID = uuidv4();

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
    tagValueID: uuidv4(),
    name: value,
  }));

  return { keys, values };
};
