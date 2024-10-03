import { FService } from './FirebaseService.ts';

class AdminSalesController {
    static async getSales() {
        try {
            const ordersSnapshot = await FService.getDocuments('orders');
            const dishCountMap = {};

            ordersSnapshot.forEach(orderDoc => {
                const orderData = orderDoc.data();
                const orderItems = orderData.items || {};

                Object.keys(orderItems).forEach(dishId => {
                    const quantity = orderItems[dishId].quantity || 0;

                    if (dishCountMap[dishId]) {
                        dishCountMap[dishId] += quantity;
                    } else {
                        dishCountMap[dishId] = quantity;
                    }
                });
            });

            const salesSnapshot = await FService.getDocuments('sales');
            const existingSales = {};

            salesSnapshot.forEach(doc => {
                existingSales[doc.id] = doc.data();
            });

            for (const dishId in dishCountMap) {
                const count = dishCountMap[dishId];
                const dishDoc = await FService.getDocument('dishes', dishId);

                if (dishDoc.exists()) {
                    const dishData = {
                        id: dishId,
                        ...dishDoc.data(),
                        count: count,
                    };

                    if (!existingSales[dishId] || existingSales[dishId].count !== count) {
                        await FService.setDocument('sales', dishId, dishData);
                    }
                }
            }

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

        if (salesSnapshot.exists) {
            currentQuantity = salesSnapshot.data().quantity || 0;
        }

        // Update the quantity
        const newQuantity = currentQuantity + quantity;

        // Set or update the sales document
        await FService.setDocument(salesRef, { quantity: newQuantity });
    }
}

export default AdminSalesController;
