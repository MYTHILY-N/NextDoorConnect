import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

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
     await Product.findByIdAndUpdate(productId, updateData);

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
