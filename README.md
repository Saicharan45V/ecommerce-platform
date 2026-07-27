# Full-Stack E-Commerce Platform

A complete, responsive e-commerce web application featuring secure user authentication, dynamic cart management, and a relational database architecture. 

**Live Demo:** [https://ecommerce-platform-omega-nine.vercel.app/](https://ecommerce-platform-omega-nine.vercel.app/)
**Backend API:** [https://ecommerce-platform-ibq4.onrender.com](https://ecommerce-platform-ibq4.onrender.com)

---

## 🚀 Features

* **JWT Authentication:** Secure user registration and login using JSON Web Tokens and bcrypt password hashing.
* **Relational Database:** Complex PostgreSQL schema linking users, products, shopping carts, and order histories.
* **Dynamic Cart Management:** Real-time cart updates, quantity adjustments, and secure checkout routing.
* **Order Tracking:** Users can view their complete order history linked to their specific account ID.
* **Responsive UI:** Modern, Flexbox-driven frontend designed to mirror professional e-commerce layouts (e.g., Amazon-style cart).

---

## 💻 Tech Stack

**Frontend:**
* React.js (Vite)
* Custom CSS3 (Flexbox/Grid layouts)
* React Hooks (useState, useEffect) for state management

**Backend:**
* Node.js & Express.js
* RESTful API architecture
* JWT (JSON Web Tokens) & bcrypt for security

**Database:**
* PostgreSQL (Hosted on Neon)
* `pg` Node module for database querying

---

## ⚙️ Database Architecture

The platform runs on a fully relational PostgreSQL database utilizing multiple `INNER JOIN` queries to resolve complex data requests. 

* **`users`**: Manages credentials and authentication.
* **`products`**: Stores inventory data, pricing, and image URLs.
* **`cart_items`**: Maps users to products using foreign keys with cascading deletes.
* **`orders` & `order_items`**: Records historical transaction data and shipping addresses.

---

## 🛠️ Local Installation

If you want to run this project locally, follow these steps:

**1. Clone the repository:**
```bash
git clone https://github.com/Saicharan45V/ecommerce-platform.git
cd ecommerce-platform