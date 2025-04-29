const nodemailer = require('nodemailer');

// Create a transporter using Gmail with more secure settings
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
    }
});

// Test the connection on startup
transporter.verify(function(error, success) {
    if (error) {
        console.log('Email Server Error:', error);
        console.log('Email Configuration:', {
            user: process.env.EMAIL_USER ? 'Set' : 'Not Set',
            pass: process.env.EMAIL_PASSWORD ? 'Set' : 'Not Set'
        });
    } else {
        console.log('Email server is ready to send messages');
        console.log('Using email account:', process.env.EMAIL_USER);
    }
});

// Email templates for different order statuses
const emailTemplates = {
    Ordered: (orderDetails) => ({
        subject: 'Order Confirmation - Xaphora Dress',
        text: `Thank you for your order!\n\nOrder ID: ${orderDetails._id}\nTotal Amount: Rs.${orderDetails.totalAmount}\n\nWe'll notify you once your order is packed and ready for shipping.`
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
        console.log('Starting email send process...');
        console.log('Order details:', {
            orderId: order._id,
            status: order.status,
            totalAmount: order.totalAmount
        });
        console.log('User details:', {
            userId: user._id,
            email: user.email
        });
        
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

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: emailContent.subject,
            text: emailContent.text
        };

        console.log('Attempting to send email with options:', mailOptions);

        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', result);
        return true;
    } catch (error) {
        console.error('Error sending order email:', error);
        console.error('Full error details:', {
            message: error.message,
            code: error.code,
            command: error.command,
            response: error.response
        });
        return false;
    }
};

module.exports = { sendOrderEmail }; 