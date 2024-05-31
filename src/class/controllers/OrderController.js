import { FController } from "./controller.ts";

class OrderController {
    static async get() {
        // Implement get orders logic if needed
    }

    static async create(email, cartData) {
        try {
            const referenceNumber = cartData.referenceNumber;
            if (!referenceNumber) {
                throw new Error('Reference number is missing in cartData');
            }
            await FController.setDocument(`Orders/${email}/orders`, referenceNumber, cartData);
        } catch (error) {
            throw error;
        }
    }

    static async uploadSlip(slip) {
        // Implement slip upload logic if needed
    }
}

export default OrderController;
