const chai = require("chai");
// const { inspect } = require("util");
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
    beforeEach(async () => {
      this.order = this.orderStorage.alreadyContains({
        id: "some empty order id",
        data: [],
      });

      this.result = this.orderSystem.display(this.order.id);
    });

    it("will show no order items", () => {
      expect(this.result).to.eventually.have.property("items").that.is.empty;
    });

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

  context("Given that the order contains beverages", () => {
    beforeEach(async () => {
      this.espresso = {
        id: "espresso id",
        name: "Espresso",
        price: 1.5,
      };
      this.mochaccino = {
        id: "mochaccino id",
        name: "Mochaccino",
        price: 2.3,
      };
      this.order = this.orderStorage.alreadyContains({
        id: "some non empty order id",
        data: [
          { beverage: this.espresso, quantity: 1 },
          { beverage: this.mochaccino, quantity: 2 },
        ],
      });
      this.result = this.orderSystem.display(this.order.id);
    });

    it("will show one item per beverage", () =>
      expect(this.result)
        .to.eventually.have.property("items")
        .that.is.deep.equal(this.order.data));

    it("will show the sum of the unit prices as total price", () =>
      expect(this.result)
        .to.eventually.have.property("totalPrice")
        .that.is.equal(6.1));

    it("will be possible to place the order");
    it("will be possible to add a beverage");
    it("will be possible to remove a beverage");
    it("will be possible to change the quantity of a beverage");
  });

  context("Given that the order has pending messages", () => {
    it("will show the pending messages");
    it("there will be no more pending messages");
  });
});
