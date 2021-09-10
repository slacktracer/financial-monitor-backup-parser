export const makeGetAccountIDByName =
  ({ formattedAccounts }) =>
  ({ accountName }) =>
    formattedAccounts.find((account) => account.name === accountName).accountID;
