import { firebaseInstance } from "./firebase.ts";
import User from "./User";

class Customer extends User{

    // TODO: Implement CRUD operations for orders
    static async addToCart(dishId) {
        try {

            const user = firebaseInstance.auth.currentUser;
            if (!user) {
            throw new Error('User not authenticated.');
        }
  
        // const dishRef = doc(db, 'dishes', dishId);
        // const dishDoc = await getDoc(dishRef);

        const dishDoc =  await firebaseInstance.getDocument('dishes', dishId);
  
        if (dishDoc.exists()) {
          const dishData = dishDoc.data();
  
            const cartDoc = await firebaseInstance.getDocument('cart', user.email);

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
  
            await firebaseInstance.updateDocument('cart', user.email, {items: cartItems})
            } else {
                const newCartItems = {
                [dishId]: {
                    name: dishData.name,
                    description: dishData.description,
                    price: dishData.price,
                    quantity: 1
                }
            };

            await firebaseInstance.setDocument('cart', user.email, {items: newCartItems})
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

    static async persistDeletedCartItems(updatedCartItems) {
        const user = firebaseInstance.auth.currentUser;
        await firebaseInstance.updateDocument('cart', user?.email, {items:updatedCartItems});
    }
    
    static async persistCartItemQuantity(dishId, newQuantity) {
        const user = firebaseInstance.auth.currentUser;
        await firebaseInstance.updateDocument('cart', user?.email, {[`items.${dishId}.quantity`]: newQuantity});
    }

    // order history of customers
    static async getOrders(){

    }

    static async createOrder(){

    }

    static async uploadOrderTransactionSlip(){

    }
}

export default Customer;