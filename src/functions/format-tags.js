import { v4 as uuidv4 } from "uuid";

export const formatTags = ({ formattedOperations, groupsAndCategories }) => {
  const categoryTagKeyID = uuidv4();
  const groupTagKeyID = uuidv4();

  const tagKeys = [
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

  const tagValues = allGroupsAndCategories.map((value) => ({
    tagValueID: uuidv4(),
    name: value,
  }));

  const tags = formattedOperations
    .map((formattedOperation) => [
      {
        operationID: formattedOperation.operationID,
        tagID: uuidv4(),
        tagKeyID: categoryTagKeyID,
        tagValueID: tagValues.find(
          (tagValue) => tagValue.name === formattedOperation.categoryName,
        ).tagValueID,
      },
      {
        operationID: formattedOperation.operationID,
        tagID: uuidv4(),
        tagKeyID: groupTagKeyID,
        tagValueID: tagValues.find(
          (tagValue) => tagValue.name === formattedOperation.groupName,
        ).tagValueID,
      },
    ])
    .flat();

  return { tags, tagKeys, tagValues };
};
