import { firebaseInstance } from "./firebase.ts"

class Cart {
  constructor() {
    this.items = {};
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
