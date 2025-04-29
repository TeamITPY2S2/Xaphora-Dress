const mongoose = require('mongoose');
const Order = require('../models/OrderModel');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/xaphora-dress', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Update orders to ensure they have the correct structure
async function updateOrders() {
  try {
    console.log('Starting order update process...');
    
    // Find all orders
    const orders = await Order.find({});
    console.log(`Found ${orders.length} orders to update`);
    
    let updatedCount = 0;
    
    for (const order of orders) {
      let needsUpdate = false;
      
      // Check if items have the correct structure
      if (order.items && order.items.length > 0) {
        for (let i = 0; i < order.items.length; i++) {
          const item = order.items[i];
          
          // Ensure productId is an ObjectId
          if (item.productId && typeof item.productId === 'string') {
            try {
              item.productId = new mongoose.Types.ObjectId(item.productId);
              needsUpdate = true;
            } catch (err) {
              console.error(`Invalid productId for order ${order._id}, item ${i}:`, err);
            }
          }
          
          // Ensure size is present
          if (!item.size) {
            item.size = 'N/A';
            needsUpdate = true;
          }
          
          // Ensure quantity is a number
          if (typeof item.quantity !== 'number') {
            item.quantity = 1;
            needsUpdate = true;
          }
          
          // Ensure price is a number
          if (typeof item.price !== 'number') {
            item.price = 0;
            needsUpdate = true;
          }
          
          // Ensure imageUrl is present
          if (!item.imageUrl) {
            item.imageUrl = 'https://via.placeholder.com/150';
            needsUpdate = true;
          }
        }
      }
      
      // Ensure shippingAddress has the correct structure
      if (order.shippingAddress) {
        if (typeof order.shippingAddress === 'string') {
          order.shippingAddress = {
            fullName: order.customerName || 'Unknown',
            address: order.shippingAddress,
            phone: 'Not provided'
          };
          needsUpdate = true;
        } else if (!order.shippingAddress.fullName) {
          order.shippingAddress.fullName = order.customerName || 'Unknown';
          needsUpdate = true;
        }
      } else {
        order.shippingAddress = {
          fullName: order.customerName || 'Unknown',
          address: 'Address not provided',
          phone: 'Not provided'
        };
        needsUpdate = true;
      }
      
      // Ensure paymentMethod is valid
      if (!order.paymentMethod || !['credit_card', 'debit_card', 'cash_on_delivery'].includes(order.paymentMethod)) {
        order.paymentMethod = 'credit_card';
        needsUpdate = true;
      }
      
      // Ensure status is valid
      if (!order.status || !['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(order.status)) {
        order.status = 'pending';
        needsUpdate = true;
      }
      
      // Update the order if needed
      if (needsUpdate) {
        await order.save();
        updatedCount++;
        console.log(`Updated order ${order._id}`);
      }
    }
    
    console.log(`Update complete. Updated ${updatedCount} orders.`);
    process.exit(0);
  } catch (error) {
    console.error('Error updating orders:', error);
    process.exit(1);
  }
}

// Run the update function
updateOrders(); 