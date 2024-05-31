import { FController } from "./controllers/controller.ts";

class Cart {
  constructor() {
    this.items = {};
  }

  async fetchCartData() {
    try {
      const user = FController.auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated.');
      }

      const cartDoc = await FController.getDocument('cart', user.email);

      if (cartDoc.exists()) {
        const cartData = cartDoc.data();
        this.items = cartData.items || {};
      } else {
        this.items = {}; // Set items to an empty object if cart is not found
      }
    } catch (error) {
      throw error;
    }
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