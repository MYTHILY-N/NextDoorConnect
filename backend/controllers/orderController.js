import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { sendSMS } from "../services/twilioService.js";

// Place a new order
export const placeOrder = async (req, res) => {
  try {
    const { userId, productId, amount, paymentMethod, deliveryDetails, paidOnline, rentalStartDate, rentalEndDate } = req.body;
 
     // 1. Create order record
     const newOrder = await Order.create({
       user: userId,
       product: productId,
       amount,
       paymentMethod,
       deliveryDetails,
       paidOnline,
       rentalStartDate,
       rentalEndDate,
     });
 
     // 2. Update product status
     const updateData = {};
     if (rentalEndDate) {
       updateData.status = "rented";
       updateData.rentedUntil = rentalEndDate;
     } else {
       updateData.status = "sold";
     }
      const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });

      // 🔔 Send SMS to Seller
      console.log(`[Order] Checking seller notification for product: ${productId}`);
      try {
        if (updatedProduct) {
          let sellerPhone = updatedProduct.sellerPhone;
          let sellerName = updatedProduct.sellerName;

          // Fallback: If product doesn't have phone, fetch from User model
          if (!sellerPhone && updatedProduct.sellerId) {
            console.log(`[Order] sellerPhone missing on product. Fetching from User: ${updatedProduct.sellerId}`);
            const sellerUser = await User.findById(updatedProduct.sellerId);
            if (sellerUser) {
              sellerPhone = sellerUser.phone;
              sellerName = sellerUser.fullName;
            }
          }

          console.log(`[Order] Seller Contact - Name: ${sellerName}, Phone: ${sellerPhone}`);

          if (sellerPhone) {
            const mode = rentalEndDate ? "RENTED" : "ORDERED (Sold)";
            const sellerMsg = `Hello ${sellerName || 'Seller'}! Your product "${updatedProduct.title}" has been ${mode}. Check your NextDoor Connect dashboard for order details.`;
            await sendSMS(sellerPhone, sellerMsg);
          } else {
            console.warn(`⚠️ [Order] No seller phone found via Product or User record for product ${productId}. SMS not sent.`);
          }
        } else {
          console.error(`❌ [Order] Product ${productId} not found during status update.`);
        }
      } catch (smsError) {
        console.error("⚠️ Order SMS to seller failed:", smsError.message);
      }

    // 3. Add to user's purchased products history
    await User.findByIdAndUpdate(userId, {
      $push: { purchasedProducts: productId }
    });

    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error placing order", error: error.message });
  }
};

// Get current user's order history
export const getMyOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ user: userId }).populate("product");
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching orders", error: error.message });
  }
};
