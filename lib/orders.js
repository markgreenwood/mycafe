const R = require("ramda");

const getBeveragePrice = R.path(['beverage', 'price']);
const getBeverageQty = R.prop('quantity');

module.exports = orderDAO => ({
  display: orderId => {
    return new Promise((resolve, reject) =>
      orderDAO.byId(orderId, (err, data) => {
        if (err) {
          reject(err);
        }

        resolve({
          items: data,
          totalPrice: 0,
          actions: [
            {
              action: "append-beverage",
              parameters: {
                beverageRef: null,
                quantity: 0,
              },
              target: orderId,
            },
          ],
        });
      })
    );
  },
});
