module.exports = orderDAO => ({
  display: orderId => {
    const items = orderDAO.byId(orderId);
    return {
      items,
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
  },
});
