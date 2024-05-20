import { auth, db } from '../firebase';
import { setDoc, getDoc, doc, updateDoc } from "firebase/firestore";

class Cart {
  constructor() {
    this.items = {};
  }

  static async addToCart(dishId) {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated.');
      }

      const dishRef = doc(db, 'dishes', dishId);
      const dishDoc = await getDoc(dishRef);

      if (dishDoc.exists()) {
        const dishData = dishDoc.data();

        const cartRef = doc(db, 'cart', user.email);
        const cartDoc = await getDoc(cartRef);

        if (cartDoc.exists()) {
          const cartData = cartDoc.data();
          const cartItems = cartData.items || {};

          if (cartItems[dishId]) {
            cartItems[dishId].quantity += 1;
          } else {
            cartItems[dishId] = {
              name: dishData.name,
              description: dishData.description,
              price: dishData.price,
              quantity: 1
            };
          }

          await updateDoc(cartRef, { items: cartItems });
        } else {
          const newCartItems = {
            [dishId]: {
              name: dishData.name,
              description: dishData.description,
              price: dishData.price,
              quantity: 1
            }
          };

          await setDoc(cartRef, { items: newCartItems });
        }

        alert('Item added to cart!');
      } else {
        alert('Dish not found.');
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      alert('Failed to add item to cart. See console for details.');
    }
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
