import CartController from "./controllers/CartController";

class Cart {
  constructor() {
    this.items = {};
  }

  async fetchCartData() {
    await CartController.getCartData(this);
  }

  updateItemQuantity(dishId, newQuantity) {
    if (this.items[dishId]) {
      this.items[dishId].quantity = newQuantity;
    }
  }

  deleteSelectedItems(selectedItems) {
    this.items = Object.fromEntries(
      Object.entries(this.items).filter(
        ([dishId]) => !selectedItems.has(dishId)
      )
    );
  }

  calculateTotalPrice() {
    return Object.values(this.items).reduce(
      (acc, item) => acc + item.price * item.quantity, 0
    );
  }
}

export default Cart;