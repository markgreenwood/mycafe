const chai = require("chai");
const order = require("./support/examples/orders");
const newStorage = require("./support/storageDouble");
const orderSystemWith = require("../lib/orders");

const { expect } = chai;
chai.use(require("chai-as-promised"));

describe("Customer displays order", () => {
  beforeEach(async () => {
    this.orderStorage = newStorage();
    this.orderSystem = orderSystemWith(this.orderStorage.dao());
  });

  context("Given that the order is empty", () => {
    beforeEach(() => {
      this.order = this.orderStorage.alreadyContains(order.empty());
      this.result = this.orderSystem.display(this.order.id);
      return this.result;
    });

    it("will show no order items", () =>
      expect(this.result).to.eventually.have.property("items").that.is.empty);

    it("will show 0 as the total price", () => {
      expect(this.result)
        .to.eventually.have.property("totalPrice")
        .that.is.equal(0);
    });

    it("will only be possible to add a beverage", () =>
      expect(this.result)
        .to.eventually.have.property("actions")
        .that.is.deep.equal([
          {
            action: "append-beverage",
            target: this.order.id,
            parameters: {
              beverageRef: null,
              quantity: 0,
            },
          },
        ]));
  });

  const scenarioOrderContainsBeverages = testExample => {
    context(`Given that the order contains ${testExample.title}`, () => {
      beforeEach(async () => {
        this.order = this.orderStorage.alreadyContains(order.withItems(testExample.items));
        this.orderActions = order.actionsFor(this.order);
        this.result = this.orderSystem.display(this.order.id);
      });

      it("will show one item per beverage", () =>
        expect(this.result)
          .to.eventually.have.property("items")
          .that.is.deep.equal(this.order.data));

      it("will show the sum of the unit prices as total price", () =>
        expect(this.result)
          .to.eventually.have.property("totalPrice")
          .that.is.equal(testExample.expectedTotalPrice));

      it("will be possible to place the order", async () =>
        expect(this.result)
          .to.eventually.have.property("actions")
          .that.deep.include(this.orderActions.place()));

      it("will be possible to add a beverage", () =>
        expect(this.result)
          .to.eventually.have.property("actions")
          .that.deep.include(this.orderActions.appendItem()));

      it("will be possible to remove a beverage", () =>
        expect(this.result)
          .to.eventually.have.property("actions")
          .that.deep.include(this.orderActions.removeItem(0))
          .and.that.deep.include(this.orderActions.removeItem(1)));

      it("will be possible to change the quantity of a beverage", () =>
        expect(this.result)
          .to.eventually.have.property("actions")
          .that.deep.include(this.orderActions.editItemQuantity(0))
          .and.that.deep.include(this.orderActions.editItemQuantity(1)));
    });
  };

  [
    {
      title: "1 Espresso and 2 Mochaccinos",
      items: [{ beverage: "espresso", quantity: 1 }, { beverage: "mochaccino", quantity: 2 }],
      expectedTotalPrice: 6.1,
    },
    {
      title: "1 Mochaccino, 2 Espressos, and 1 Capuccino",
      items: [
        { beverage: "mochaccino", quantity: 1 },
        { beverage: "espresso", quantity: 2 },
        { beverage: "capuccino", quantity: 1 },
      ],
      expectedTotalPrice: 7.3,
    },
  ].forEach(scenarioOrderContainsBeverages);

  context("Given that the order has pending messages", () => {
    it("will show the pending messages");
    it("there will be no more pending messages");
  });
});
