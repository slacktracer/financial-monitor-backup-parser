export const parseAmount = ({ amount }) => {
  let [mainPart, fractionalPart] = amount.split(",");

  if (fractionalPart) {
    const paddedFractionalPart = fractionalPart.padEnd(2, "0");

    const parsedAmount = Number(mainPart + paddedFractionalPart);

    return parsedAmount;
  }

  return Number(mainPart + "00");
};
