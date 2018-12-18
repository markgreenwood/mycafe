// const { inspect } = require("util");
const chai = require("chai");
const newStorage = require("./support/storageDouble");
const orderSystemWith = require("../lib/orders");

const { expect } = chai;
chai.use(require("chai-as-promised"));

// const displayResult = thing => {
//   console.log(`${inspect(thing, { depth: 5 })}\n`);
//   return thing;
// };

describe("Customer displays order", () => {
  beforeEach(async () => {
    this.orderStorage = newStorage();
    this.orderSystem = orderSystemWith(this.orderStorage.dao());
  });

  context("Given that the order is empty", () => {
    let result;

    beforeEach(async () => {
      this.order = this.orderStorage.alreadyContains({
        id: "some empty order id",
        data: [],
      });

      result = await this.orderSystem.display(this.order.id);
      return result;
    });

    it("will show no order items", () => {
      // eslint-disable-next-line no-unused-expressions
      expect(result).to.have.property("items").that.is.empty;
    });

    it("will show 0 as the total price", () => {
      expect(result)
        .to.have.property("totalPrice")
        .that.is.equal(0);
    });

    it("will only be possible to add a beverage", () =>
      expect(result)
        .to.have.property("actions")
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
    let result;

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
      result = await this.orderSystem.display(this.order.id);
      return result;
    });

    it("will show one item per beverage", () =>
      expect(result)
        .to.have.property("items")
        .that.is.deep.equal(this.order.data));

    it("will show the sum of the unit prices as total price", () =>
      expect(result)
        .to.have.property("totalPrice")
        .that.is.equal(6.1));

    it("will be possible to place the order", async () => {
      await result;
      console.log(result.actions);

      return expect(result)
        .to.have.property("actions")
        .that.include({ action: "place-order", target: this.order.id });
    });

    it("will be possible to add a beverage");
    it("will be possible to remove a beverage");
    it("will be possible to change the quantity of a beverage");
  });

  context("Given that the order has pending messages", () => {
    it("will show the pending messages");
    it("there will be no more pending messages");
  });
});
