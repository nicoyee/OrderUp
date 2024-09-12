import { FService } from "./FirebaseService.ts";

class PaymentController {
    static async recordPaymentTransaction(orderId, paymentLinkId, amountPaid, paymentStatus) {
      try {
        const paymentData = {
          orderId: orderId,
          paymentLinkId: paymentLinkId,
          amount: amountPaid,
          status: paymentStatus,
          createdDate: new Date(),
        };
  
        await FService.setDocument(`Payments`, paymentLinkId, paymentData);
        await FService.updateDocument(`Orders`, orderId, {
          paymentStatus: paymentStatus,
          amountPaid: amountPaid,
        });
  
        console.log(`Payment of ₱${amountPaid} recorded successfully as "${paymentStatus}".`);
      } catch (error) {
        console.error("Error recording payment transaction:", error);
        throw error;
      }
    }
  }
  

export default PaymentController;
