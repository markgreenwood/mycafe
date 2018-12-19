const beverage = require("./beverages");

let counter = 0;

function asOrderItem(itemExample) {
  return {
    beverage: beverage[itemExample.beverage](),
    quantity: itemExample.quantity,
  };
}

module.exports = {
  empty: () => ({
    id: "<empty order>",
    data: [],
  }),
  withItems: itemExamples => {
    counter += 1;
    return {
      id: `<non empty order ${counter}>`,
      data: itemExamples.map(asOrderItem),
    };
  },
};
