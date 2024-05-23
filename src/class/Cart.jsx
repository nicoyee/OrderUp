
import { auth, db } from '../firebase';
import { getDoc, doc, updateDoc } from "firebase/firestore";

class Cart {
  constructor() {
    this.items = {};
  }

  async fetchCartData() {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated.');
      }

      const cartRef = doc(db, 'cart', user.email);
      const cartDoc = await getDoc(cartRef);

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
    if (this.items[dishId]) {
      this.items[dishId].quantity = newQuantity;
    }
  }

  async persistItemQuantity(dishId, newQuantity) {
    const user = auth.currentUser;
    const cartRef = doc(db, 'cart', user.email);
    await updateDoc(cartRef, {
      [`items.${dishId}.quantity`]: newQuantity,
    });
  }

  deleteSelectedItems(selectedItems) {
    this.items = Object.fromEntries(
      Object.entries(this.items).filter(
        ([dishId]) => !selectedItems.has(dishId)
      )
    );
  }

  async persistDeletedItems() {
    const user = auth.currentUser;
    const cartRef = doc(db, 'cart', user.email);
    await updateDoc(cartRef, {
      items: this.items,
    });
  }

  calculateTotalPrice() {
    return Object.values(this.items).reduce(
      (acc, item) => acc + item.price * item.quantity, 0
    );
  }
}

export default Cart;


