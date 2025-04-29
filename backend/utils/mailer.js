const nodemailer = require('nodemailer');

// Create a transporter using Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Email templates for different order statuses
const emailTemplates = {
    Ordered: (orderDetails) => ({
        subject: 'Order Confirmation - Xaphora Dress',
        text: `Thank you for your order!\n\nOrder ID: ${orderDetails._id}\nTotal Amount: $${orderDetails.totalAmount}\n\nWe'll notify you once your order is packed and ready for shipping.`
    }),
    Packed: (orderDetails) => ({
        subject: 'Order Packed - Xaphora Dress',
        text: `Your order has been packed and will be shipped soon!\n\nOrder ID: ${orderDetails._id}\nTotal Amount: $${orderDetails.totalAmount}`
    }),
    Shipped: (orderDetails) => ({
        subject: 'Order Shipped - Xaphora Dress',
        text: `Your order is on its way!\n\nOrder ID: ${orderDetails._id}\nTracking Number: ${orderDetails.trackingNumber || 'Will be updated soon'}`
    }),
    Delivered: (orderDetails) => ({
        subject: 'Order Delivered - Xaphora Dress',
        text: `Your order has been delivered!\n\nOrder ID: ${orderDetails._id}\nThank you for shopping with Xaphora Dress.`
    })
};

// Function to send order status emails
const sendOrderEmail = async (order, user) => {
    try {
        console.log('Attempting to send email with order:', order);
        console.log('User details:', user);
        
        if (!user || !user.email) {
            console.error('User email not found. User:', user);
            throw new Error('User email not found');
        }

        const template = emailTemplates[order.status];
        if (!template) {
            console.error(`Invalid order status: ${order.status}. Valid statuses:`, Object.keys(emailTemplates));
            throw new Error('Invalid order status');
        }

        const emailContent = template(order);
        console.log('Email content prepared:', emailContent);

        console.log('Sending email with config:', {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: emailContent.subject
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: emailContent.subject,
            text: emailContent.text
        });

        console.log(`Order status email sent successfully to ${user.email}`);
        return true;
    } catch (error) {
        console.error('Error sending order email:', error);
        console.error('Error details:', error.message);
        if (error.code === 'EAUTH') {
            console.error('Authentication failed. Please check your email credentials.');
        }
        return false;
    }
};

module.exports = { sendOrderEmail }; 