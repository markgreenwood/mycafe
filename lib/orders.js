const R = require("ramda");

const getBeveragePrice = R.path(["beverage", "price"]);
const getBeverageQty = R.prop("quantity");

module.exports = orderDAO => ({
  display: orderId =>
    new Promise((resolve, reject) =>
      orderDAO.byId(orderId, (err, data) => {
        if (err) {
          reject(err);
        }

        const lineItemTotals = R.map(R.converge(R.multiply, [getBeveragePrice, getBeverageQty]));

        const actions = [
          {
            action: "append-beverage",
            parameters: {
              beverageRef: null,
              quantity: 0,
            },
            target: orderId,
          },
        ];

        if (R.length(data) > 0) {
          actions.push({
            action: "place-order",
            target: orderId,
          });
        }

        resolve({
          items: data,
          totalPrice: R.sum(lineItemTotals(data)),
          actions,
        });
      })
    ),
});
