module.exports = () => ({
  display: (orderId, callback) => {
    const err = null;
    const data = {
      items: [],
      totalPrice: 0,
      actions: [
        {
          action: "append-beverage",
          parameters: {
            beverageRef: null,
            quantity: 0,
          },
          target: "some empty order id",
        },
      ],
    };
    return callback(err, data);
  },
});
