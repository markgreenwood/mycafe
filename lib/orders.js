module.exports = (/* orderDAO */) => ({
  display: orderId =>
    Promise.resolve({
      items: [],
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
    }),
});
