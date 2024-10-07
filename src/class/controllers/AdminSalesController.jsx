import { FService } from './FirebaseService.ts';

class AdminSalesController {
    static async getSales(userEmail) {
        try {
            const ordersCollectionPath = `Orders/${userEmail}/orders`;
            // Fetch orders for the specified user
            const ordersSnapshot = await FService.getDocuments(ordersCollectionPath);
            const dishCountMap = {};

            // Loop through each order for the user
            ordersSnapshot.forEach(orderDoc => {
                const orderData = orderDoc.data();
                const orderItems = orderData.items || {};

                // Loop through each item in the order
                Object.keys(orderItems).forEach(dishId => {
                    const quantity = orderItems[dishId].quantity || 0;

                    // Add or update dish count in the map
                    if (dishCountMap[dishId]) {
                        dishCountMap[dishId] += quantity;
                    } else {
                        dishCountMap[dishId] = quantity;
                    }
                });
            });

            // Check if the sales collection exists and create an initial document if necessary
            const salesSnapshot = await FService.getDocuments('sales');
            if (salesSnapshot.empty) {
                // If the collection is empty, create an initial document
                await FService.setDocument('sales', 'initial', { message: 'Sales collection created' });
            }

            // Update or add the sales data
            for (const dishId in dishCountMap) {
                const count = dishCountMap[dishId];
                const dishDoc = await FService.getDocument('dishes', dishId);

                if (dishDoc.exists()) {
                    const dishData = {
                        id: dishId,
                        ...dishDoc.data(),
                        count: count,
                    };

                    // Use setDocument to update or create sales data for each dish
                    await FService.setDocument('sales', dishId, { ...dishData, count });
                }
            }

            // Retrieve and sort the updated sales data
            const updatedSalesSnapshot = await FService.getDocuments('sales');
            let updatedSales = updatedSalesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            updatedSales = updatedSales.sort((a, b) => b.count - a.count);
            return updatedSales;
        } catch (error) {
            console.error('Error fetching sales:', error);
            throw error;
        }
    }

    static async updateSales({ dishId, quantity }) {
        const salesRef = `sales/${dishId}`; // Corrected reference path

        // Fetch current sales data
        const salesSnapshot = await FService.getDocument(salesRef);
        let currentQuantity = 0;

        if (salesSnapshot.exists()) {
            currentQuantity = salesSnapshot.data().count || 0; // Ensure you access the correct field
        }

        // Update the quantity
        const newQuantity = currentQuantity + quantity;

        // Set or update the sales document
        await FService.setDocument(salesRef, { count: newQuantity }); // Ensure you're updating the correct field
    }
}

export default AdminSalesController;
