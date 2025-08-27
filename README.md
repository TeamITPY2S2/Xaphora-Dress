⸻

🛍️ Xaphora Dress – E-Commerce Platform

Xaphora Dress is a role-based online clothing store built using the MERN stack (MongoDB, Express.js, React.js, Node.js).
It provides a secure and scalable solution for customers, sellers, and admins with authentication, inventory, order, payment, delivery, and feedback management — plus an integrated AI chatbot for customer support.

⸻

🚀 Features

👥 Role-Based Access

Customers
	•	Register, login, and manage profile.
	•	Secure password reset via email.
	•	Browse clothing products with categories & filters.
	•	Add items to cart, manage cart, and checkout.
	•	Save delivery addresses.
	•	View order history and track order status.
	•	Provide feedback & reviews on purchased products.
	•	Earn and use loyalty points.

Sellers
	•	Manage personal store inventory (add, update, delete products).
	•	Upload product images (Cloudinary integration).
	•	View stock levels and get low-stock alerts.
	•	Track and update order statuses (processing, shipped, delivered).
	•	Dashboard with sales insights and inventory summary.

Admins
	•	Manage users (customers, sellers).
	•	Approve or suspend sellers.
	•	Full access to order, inventory, and delivery data.
	•	Monitor platform activity with analytics dashboard.
	•	Handle escalated customer complaints.

⸻

📦 Inventory & Product Management
	•	Add, edit, or remove products.
	•	Product categories (men, women, kids, accessories, etc.).
	•	Stock management with automatic low-stock alerts.
	•	Product search and filtering.
	•	Product images & descriptions (Cloudinary upload).

⸻

🛒 Order Management
	•	Place orders directly from cart.
	•	Track order status (pending, confirmed, shipped, delivered).
	•	Order cancellation & refunds (admin/seller controlled).
	•	Invoice generation.

⸻

💳 Payment Management
	•	Secure checkout process.
	•	Multiple payment methods (e.g., card, cash on delivery).
	•	Mock payment integration for demo purposes.
	•	Apply loyalty points for discounts.
	•	Payment confirmation notifications.

⸻

🚚 Delivery Management
	•	Delivery partner assignment.
	•	Update delivery status (in transit, delivered).
	•	Delivery tracking visible to customers.
	•	Estimated delivery time notifications.

⸻

📝 Feedback & Reviews
	•	Customers can add reviews for products.
	•	Rating system (e.g., ⭐ out of 5).
	•	Admins can monitor inappropriate reviews.
	•	Feedback dashboard for sellers to see customer satisfaction.

⸻

🤖 AI Chatbot Integration
	•	Handles FAQs and product inquiries.
	•	Provides order status updates to customers.
	•	Helps with return/refund queries.
	•	Available 24/7 for customer support.

⸻

📊 Dashboards
	•	Admin Dashboard: Users, orders, sellers, sales analytics.
	•	Seller Dashboard: Inventory, low-stock alerts, sales summary.
	•	Customer Dashboard: Orders, profile, loyalty points.

⸻

🔐 Authentication & Security
	•	JWT-based authentication.
	•	Role-based access control (customer, seller, admin).
	•	Secure password hashing (bcrypt).
	•	Protected routes for sensitive operations.

⸻

🔔 Notifications & Alerts
	•	Email notifications for order confirmations and password resets.
	•	Low-stock alerts for sellers.
	•	Delivery updates for customers.

⸻

🛠️ Tech Stack
	•	Frontend: React.js, TailwindCSS (responsive UI)
	•	Backend: Node.js, Express.js
	•	Database: MongoDB (Mongoose ODM)
	•	Authentication: JWT (JSON Web Token)
	•	Other: Cloudinary (image upload), AI Chatbot Integration

⸻

⚙️ Installation & Setup
	1.	Clone the repo

git clone https://github.com/<your-username>/xaphora-dress.git
cd xaphora-dress


	2.	Install dependencies

# Install server dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install


	3.	Environment variables
Create a .env file in the backend with:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_URL=your_cloudinary_api_url


	4.	Run the application

# Run backend (in /backend)
npm run dev

# Run frontend (in /frontend)
npm start

⸻

👩‍💻 Contributors
	•	Sachithra Indrachapa – User Management Module, Authentication, Admin Dashboard, Chatbot
	•	Team Members – Product Management, Order & Payment, Delivery

⸻
