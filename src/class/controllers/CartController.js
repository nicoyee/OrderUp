import { FService } from "./FirebaseService.ts";
import Cart from '../Cart.js';

class CartController {
    static async add(dishId) {
        try {
            const user = FService.auth.currentUser;
            if (!user) {
                throw new Error('User not authenticated.');
            }

            const dishDoc = await FService.getDocument('dishes', dishId);

            if (dishDoc.exists()) {
                const dishData = dishDoc.data();

                const cartDoc = await FService.getDocument('cart', user.email);

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

                    await FService.updateDocument('cart', user.email, { items: cartItems });
                } else {
                    const newCartItems = {
                        [dishId]: {
                            name: dishData.name,
                            description: dishData.description,
                            price: dishData.price,
                            quantity: 1
                        }
                    };

                    await FService.setDocument('cart', user.email, { items: newCartItems });
                }

                console.log('Item added to cart!');
            } else {
                console.log('Dish not found.');
            }
        } catch (error) {
            console.error('Error adding item to cart:', error);
            alert('Failed to add item to cart. See console for details.');
        }
    }

    static async getCartData(cartInstance = null) {
        try {
            const user = FService.auth.currentUser;
            if (!user) {
                throw new Error('User not authenticated.');
            }

            // Create cartInstance if not passed in
            if (!cartInstance) {
                cartInstance = new Cart();
            }

            const cartDoc = await FService.getDocument('cart', user.email);

            if (cartDoc.exists()) {
                const cartData = cartDoc.data();
                cartInstance.items = cartData.items || {};
            } else {
                cartInstance.items = {}; // Set items to an empty object if cart is not found
            }
            return cartInstance.items;
        } catch (error) {
            throw error;
        }
    }

    static async deleteItem(updatedCartItems) {
        const user = FService.auth.currentUser;
        await FService.updateDocument('cart', user?.email, { items: updatedCartItems });
    }

    static async quantity(dishId, newQuantity) {
        const user = FService.auth.currentUser;
        await FService.updateDocument('cart', user?.email, { [`items.${dishId}.quantity`]: newQuantity });
    }

    static async getBestSellers() {
        try {
            // Fetch all user carts
            const cartsSnapshot = await FService.getDocuments('cart');
            const dishCountMap = {};

            // Loop through each cart and tally up the quantities of dishes
            cartsSnapshot.forEach(cartDoc => {
                const cartData = cartDoc.data();
                const cartItems = cartData.items || {};

                Object.keys(cartItems).forEach(dishId => {
                    const quantity = cartItems[dishId].quantity || 0;

                    // Add the dish to the count map
                    if (dishCountMap[dishId]) {
                        dishCountMap[dishId] += quantity;
                    } else {
                        dishCountMap[dishId] = quantity;
                    }
                });
            });

            // Fetch the existing best sellers from a separate collection
            const bestSellersSnapshot = await FService.getDocuments('best_sellers');
            const existingBestSellers = {};

            bestSellersSnapshot.forEach(doc => {
                existingBestSellers[doc.id] = doc.data();
            });

            // Update or add items with count >= 10 to the best_sellers collection
            for (const dishId in dishCountMap) {
                const count = dishCountMap[dishId];
                if (count >= 10) {
                    const dishDoc = await FService.getDocument('dishes', dishId);

                    if (dishDoc.exists()) {
                        const dishData = {
                            id: dishId,
                            ...dishDoc.data(),
                            count: count, // Store the quantity count
                        };

                        // Add or update in the best_sellers collection
                        await FService.setDocument('best_sellers', dishId, dishData);
                    }
                }
            }

            // Retrieve the updated best sellers after the changes
            const updatedBestSellersSnapshot = await FService.getDocuments('best_sellers');
            let updatedBestSellers = updatedBestSellersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Sort the best sellers by quantity count in descending order
            updatedBestSellers = updatedBestSellers.sort((a, b) => b.count - a.count);

            // Limit the number of best sellers to 6
            return updatedBestSellers.slice(0, 6);
        } catch (error) {
            console.error('Error fetching best sellers:', error);
            throw error;
        }
    }
}

export default CartController;
