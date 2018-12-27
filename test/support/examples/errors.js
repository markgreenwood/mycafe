module.exports = {
  badQuantity: quantity => ({ key: "error.quantity", params: [quantity] }),
  beverageDoesNotExist: () => ({ key: "error.beverage.notExists " }),
};
