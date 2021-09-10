export const makeGetGroupIDByName =
  ({ formattedGroups }) =>
  ({ groupName }) =>
    formattedGroups.find((group) => group.name === groupName).groupID;
