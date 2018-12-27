const R = require("ramda");

const getBeveragePrice = R.path(["beverage", "price"]);
const getBeverageQty = R.prop("quantity");

module.exports = ({ order: orderDAO, message: messageDAO }) => ({
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

          data.forEach(item => {
            actions.push({
              action: "remove-beverage",
              target: orderId,
              parameters: {
                beverageRef: item.beverage.id,
              },
            });
            actions.push({
              action: "edit-beverage",
              target: orderId,
              parameters: {
                beverageRef: item.beverage.id,
                newQuantity: item.quantity,
              },
            });
          });
        }

        messageDAO.byId(orderId, (error, response) => {
          if (error) {
            reject(error);
          }

          messageDAO.update({ id: orderId, data: [] }, () => {});

          resolve({
            items: data,
            totalPrice: R.sum(lineItemTotals(data)),
            actions,
            messages: response,
          });
        });
      })
    ),
});
