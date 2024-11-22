import { FService } from './FirebaseService.ts';

class AdminSalesController {
    static async getSales(userEmail) {
        try {
            const ordersCollectionPath = `Orders/${userEmail}/orders`;
            const ordersSnapshot = await FService.getDocuments(ordersCollectionPath);
            const dishCountMap = {};

            if (ordersSnapshot.empty) {
                return []; // No orders to process
            }

            // Loop through each order for the user
            ordersSnapshot.forEach(orderDoc => {
                const orderData = orderDoc.data();
                const orderItems = orderData.items || {};

                // Parse the order date to a valid Date object
                const createdDate = orderData.createdDate?.toDate ? orderData.createdDate.toDate() : new Date(orderData.createdDate);
                const year = createdDate.getFullYear();
                const month = String(createdDate.getMonth() + 1).padStart(2, '0');

                // Loop through each item in the order
                Object.keys(orderItems).forEach(dishId => {
                    if (!dishId) return; // Skip invalid dishId

                    const quantity = orderItems[dishId]?.quantity || 0;

                    if (!dishCountMap[dishId]) dishCountMap[dishId] = {};
                    if (!dishCountMap[dishId][year]) dishCountMap[dishId][year] = {};
                    if (!dishCountMap[dishId][year][month]) {
                        dishCountMap[dishId][year][month] = { count: 0, salesDates: [] };
                    }

                    dishCountMap[dishId][year][month].count += quantity;
                    dishCountMap[dishId][year][month].salesDates.push(createdDate.toISOString());
                });
            });

            // Update or add the sales data in Firestore by year/month/dishId
            for (const dishId in dishCountMap) {
                for (const year in dishCountMap[dishId]) {
                    for (const month in dishCountMap[dishId][year]) {
                        const { count, salesDates } = dishCountMap[dishId][year][month];
                        
                        // Retrieve dish data from the 'dishes' collection to get the dish name
                        const dishDoc = await FService.getDocument('dishes', dishId);

                        if (dishDoc.exists()) {
                            const dishData = dishDoc.data();
                            const dishName = dishData.name || 'Unknown Dish';

                            const salesPath = `sales/${year}/${month}`; // The path should point to the year and month collection
                            const salesDocId = dishId; // Use dishId as the document ID

                            // Retrieve current sales data if exists, and merge salesDates
                            const salesSnapshot = await FService.getDocument(salesPath, salesDocId);
                            let existingSalesDates = [];

                            if (salesSnapshot.exists()) {
                                existingSalesDates = salesSnapshot.data().salesDates || [];
                            }

                            // Merge new sales dates, avoiding duplicates
                            const uniqueSalesDates = [...new Set([...existingSalesDates, ...salesDates])];

                            // Set or update the document in Firestore with the dish name, count, and salesDates
                            await FService.setDocument(salesPath, salesDocId, {
                                dishName, // Store the dish name
                                count,
                                salesDates: uniqueSalesDates,
                            });
                        }
                    }
                }
            }

            // Retrieve and return updated sales data, sorted by count
            const updatedSalesSnapshot = await FService.getDocuments('sales');
            let updatedSales = updatedSalesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            updatedSales = updatedSales.sort((a, b) => b.count - a.count);
            return updatedSales;

        } catch (error) {
            console.error('Error fetching or updating sales:', error);
            throw error;
        }
    }

    static async getSalesByYearAndMonth(userEmail, selectedYear, selectedMonth) {
    try {
        const salesPath = `sales/${selectedYear}/${String(selectedMonth).padStart(2, '0')}`;
        const salesSnapshot = await FService.getDocuments(salesPath);
        const salesData = salesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        return salesData;
    } catch (error) {
        console.error('Error fetching sales by year and month:', error);
        throw error;
    }
}


    static async updateSales({ dishId, quantity, year, month }) {
        try {
            const salesPath = `sales/${year}/${month}`; // Path includes year and month
            const salesDocId = dishId;
    
            // Fetch current sales data
            const salesSnapshot = await FService.getDocument(salesPath, salesDocId);
    
            if (salesSnapshot.exists()) {
                // Document exists, update the quantity
                const currentQuantity = salesSnapshot.data().count || 0;
                const newQuantity = currentQuantity + quantity;
    
                // Update the document with the new quantity
                await FService.updateDocument(salesPath, salesDocId, { count: newQuantity });
            } else {
                // Document doesn't exist, create a new document with the initial quantity
                await FService.setDocument(salesPath, salesDocId, { count: quantity });
            }
    
        } catch (error) {
            console.error('Error updating sales:', error);
            throw error;
        }
    }

    static async getfinancesales() {
        try {
            const paymentsSnapshot = await FService.getDocuments('payments');
            const paymentsData = paymentsSnapshot.docs.map(doc => doc.data());
    
            const financeData = paymentsData.map(payment => ({
                date: new Date(payment.created_at.seconds * 1000), // Convert Firestore timestamp to JS Date
                amount: payment.amount,
            }));
    
            return financeData;
        } catch (error) {
            console.error('Error fetching finance sales data:', error);
            throw error;
        }
    }    
    
}

export default AdminSalesController;
