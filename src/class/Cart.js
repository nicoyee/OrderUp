import { firebaseInstance } from "./firebase.ts"

class Cart {
  constructor() {
    this.items = {};
  }

  async fetchCartData() {
    try {
      const user = firebaseInstance.auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated.');
      }

      const cartDoc = await firebaseInstance.getDocument('cart', user.email);

      if (cartDoc.exists()) {
        const cartData = cartDoc.data();
        this.items = cartData.items || {};
      } else {
        throw new Error('Cart not found.');
      }
    } catch (error) {
      throw error;
    }
  }

  updateItemQuantity(dishId, newQuantity) {
    
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


