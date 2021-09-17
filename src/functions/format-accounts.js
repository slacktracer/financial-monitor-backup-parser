import { v4 as uuidv4 } from "uuid";

import { initialAmountsByAccount } from "../data/initial-amounts-by-account.js";
import { fixName } from "./fix-names.js";

export const formatAccounts = ({ operations, transfers }) => {
  const accounts = new Set();

  for (const transfer of operations) {
    const [, , account] = Object.values(transfer);

    accounts.add(account);
  }

  for (const transfer of transfers) {
    const [, , fromAccount, toAccount] = Object.values(transfer);

    accounts.add(fromAccount, toAccount);
  }

  const formattedAccounts = Array.from(accounts)
    .map((account) => fixName({ name: account, type: "account" }))
    .sort((accountA, accountB) => accountA.localeCompare(accountB))
    .map((account) => ({
      accountID: uuidv4(),
      initialAmount: initialAmountsByAccount[account] || 0,
      name: account,
    }));

  return formattedAccounts;
};
