# ecommerce-api-with-devops-tool
This project is a fully functional e-commerce API built with Node.js and Express , and using DevOps tools



<p align="center">
  <a href="http://nodejs.org" target="blank"><img src="https://nodejs.org/static/images/logo.svg" width="200" alt="Node.js Logo" /></a>
  <a href="https://www.docker.com/" target="blank"><img src="https://th.bing.com/th/id/R.1015dcf5e27561114bb64348fdd8da03?rik=74kMppTXFhnclg&pid=ImgRaw&r=0" width="200" alt="DevOps Logo" /></a>
</p>

  <p align="center">Efficient and scalable server-side applications built with <a href="http://nodejs.org" target="_blank">Node.js</a> and managed using <a href="https://www.docker.com/" target="_blank">DevOps tools</a>.</p>

<p align="center">
<a href="https://www.npmjs.com/" target="_blank"><img src="https://img.shields.io/npm/v/nodejs.svg" alt="NPM Version" /></a>
<a href="https://github.com/yourusername/yourproject/blob/main/LICENSE" target="_blank"><img src="https://img.shields.io/npm/l/nodejs.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/" target="_blank"><img src="https://img.shields.io/npm/dm/nodejs.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/yourusername/yourproject" target="_blank"><img src="https://img.shields.io/circleci/build/github/yourusername/yourproject/master" alt="CircleCI Build" /></a>
<a href="https://coveralls.io/github/yourusername/yourproject?branch=main" target="_blank"><img src="https://coveralls.io/repos/github/yourusername/yourproject/badge.svg?branch=main" alt="Coverage Status" /></a>
<a href="https://discord.gg/yourproject" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/yourproject#backer" target="_blank"><img src="https://opencollective.com/yourproject/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/yourproject#sponsor" target="_blank"><img src="https://opencollective.com/yourproject/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
<a href="https://paypal.me/yourusername" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
<a href="https://twitter.com/yourproject" target="_blank"><img src="https://img.shields.io/twitter/follow/yourproject.svg?style=social&label=Follow"></a>
</p>



# Node.js E-commerce API

This project is a fully functional e-commerce API built with **Node.js** and **Express**. It allows users to register, browse products, add items to a shopping cart, place orders, and make payments via card or cash on delivery. The API supports multiple user roles, including admin and manager, and offers features such as product and brand management, password reset, and more.


## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [DevOps Integration](#devops-integration)
- [Ansible Setup](#ansible-setup)
- [Testing the Application](#testing-the-application)
- [Monitoring with Prometheus and Grafana](#monitoring-with-prometheus-and-grafana)
- [Load Balancer Setup](#load-balancer-setup)
- [Contributing](#contributing)
- [License](#license)

## Features
- User registration and authentication
- Browse and view products
- Add products to shopping cart
- Place orders with payment options (credit card and cash on delivery)
- Admin and manager roles for product and brand management
- Password reset functionality
- Integrated with **ESLint** for code quality

## Technologies Used
- **Node.js**: JavaScript runtime for building the API
- **Express**: Web framework for Node.js
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: ODM for MongoDB
- **JWT**: For authentication and authorization
- **Stripe**: For handling online payments
- **Nodemailer**: For sending emails (e.g., password reset)
- **Docker**: For containerization
- **Docker Compose**: For managing multi-container Docker applications
- **Ansible**: For automation and configuration management
- **Nginx**: For load balancing and reverse proxy
- **Prometheus**: For monitoring and alerting
- **Grafana**: For visualization of metrics


### Prerequisites
- Node.js (v20 or higher)
- MongoDB (local installation or cloud-based)
- Docker and Docker Compose (for containerization)


## API Endpoints

### Authentication
- `POST /api/auth/signup`: Register a new user
- `POST /api/auth/login`: User login and obtain a JWT token
- `POST /api/auth/forgotPassword`: Request a password reset link
- `POST api/auth/verifyResetCode`: verify Reset Password
- `POST api/auth/resetPassword`: Reset Password
  
### Products
- `GET /api/products`: Get all products
- `GET /api/products/:id`: Get Product By Id
- `POST /api/products`: Create a new product (Admin)
- `PUT /api/products/:id`: Update a product (Admin)
- `DELETE /api/products/:id`: Delete a product (Admin)

### Cart
- `POST /api/cart`: Add a product to the cart
- `GET /api/cart`: Get all items in the cart
- `DELETE /api/cart/:id`: Remove an item from the cart


### Order Routes

- **Stripe Checkout**
  - `POST /api/orders/checkout-session`: Create a Stripe checkout session

- **Order Management (Protected: Requires User)**
  - `POST /api/orders`: Create a cash order
  - `GET /api/orders`: Get all orders (Filtered for logged-in users; Admin/Manager can see all)
  - `GET /api/orders/:id`: Get a specific order by ID

- **Order Status Updates (Protected: Requires Admin or Manager)**
  - `PUT /api/orders/:id/paid`: Update order status to "paid"
  - `PUT /api/orders/:id/delivered`: Update order status to "delivered"


### Categories
- `GET /api/categories`: Get all categories
- `POST /api/categories`: Create a new category (Admin)
- `PUT /api/categories/:id`: Update a category (Admin)
- `DELETE /api/categories/:id`: Delete a category (Admin)

### Subcategories
- `GET /api/subCategories`: Get all subcategories
- `POST /api/subCategories`: Create a new subcategory (Admin)
- `PUT /api/subCategories/:id`: Update a subcategory (Admin)
- `DELETE /api/subCategories/:id`: Delete a subcategory (Admin)

### Brands
- `GET /api/brands`: Get all brands
- `POST /api/brands`: Create a new brand (Admin)
- `PUT /api/brands/:id`: Update a brand (Admin)
- `DELETE /api/brands/:id`: Delete a brand (Admin)

### Reviews
- `GET /api/reviews`: Get all reviews
- `POST /api/reviews`: Add a new review
- `PUT /api/reviews/:id`: Update a review
- `DELETE /api/reviews/:id`: Delete a review

### Wish List
- `POST /api/wishList`: Add a product to the wishlist
- `GET /api/wishList`: Get all items in the wishlist
- `DELETE /api/wishList/:id`: Remove an item from the wishlist

### Addresses
- `GET /api/addresses`: Get all addresses
- `POST /api/addresses`: Add a new address
- `DELETE /api/addresses/:id`: Delete an address

### Coupons
- `GET /api/coupons`: Get all coupons
- `POST /api/coupons`: Create a new coupon (Admin)
- `PUT /api/coupons/:id`: Update a coupon (Admin)
- `DELETE /api/coupons/:id`: Delete a coupon (Admin)

---

### Installation

1. Clone the repository:
   ```bash
   mkdir nodejs-ecommerce-api-v1
   git clone https://github.com/diaaqassem/ecommerce-api-devops-tool.git
   cd nodejs-ecommerce-api-v1
   ```


## Ansible Setup
1. Add server IPs to the `ansible-playbooks/hosts` file.
2. Run the following playbooks:
   ```bash
   ansible-playbook ansible-playbooks/install-db.yml
   ansible-playbook ansible-playbooks/lv-db.yml
   ansible-playbook ansible-playbooks/install-docker-compose.yml --ask-become-pass
   ```

2. Set up the environment variables in a `.env` file (see below).
3. ## Environment Variables
Create a `.env` file in the main directory and add the following:

```bash
PORT = 3000
NODE_ENV =''
#database
DB_NAME = nodejs-ecommerce-API-v1
DB_USER = 
DB_PASSWORD = 
DB_URI = ""
BASE_URL = "http://localhost:3000/"
#mongodb://localhost:27017
#jwt
JWT_SECRET = "7f1b3eaf92c3a6d7e8b2d0fa9c4e3f8b"
JWT_EXPIRES_IN = "7d"
#email nodemailer
EMAIL_HOST= 'yourmail@hotmail.com'
EMAIL_PASSWORD="yourpassword"
EMAIL_PORT=587
EMAIL_USE_TLS=T
# stripe settings
STRIPE_SECRET_KEY = 
STRIPE_WEBHOOK_SECRET=""
```

3. Build the project:
   ```bash
   docker-compose up
   ```
##notice ( mapping port in docker-compose.yml from 4000 to 3000 app)
4. Check Docker images and running containers:
   ```bash
   docker images
   docker ps
   ```

5. Monitor application resources:
   ```bash
   top
   ```

## Testing the Application
- Use the Postman application to test the API.
- The Postman collection file is located at `postman/nodejs-ecommerce.postman_collection.json`.

7. for check network requests by using tcpdump
   ```bash
       yum install tcpdump
       tcpdump -i br-networkid -w req.pcap
       tcpdump -r req.pcap >> req.txt
```

## Monitoring with Prometheus and Grafana
1. Install Prometheus:
   - Run the file on the master:
     ```bash
     ./Prometheus/Prometheus.sh
     ```
   - Run the file on worker nodes:
     ```bash
     ./Node_exporter.sh
     ```
   - Access the Prometheus dashboard at `http://ipmaster:9090/graph` on the master.

2. Update the Prometheus configuration:
   - Go to `/etc/prometheus/Prometheus.yml` on the master and add job names for each worker node:
     ```yaml
     - job_name: "node1"
       static_configs:
         - targets: ["nodeip:9100"]
     ```
   - Restart Prometheus:
     ```bash
     systemctl restart prometheus
     ```
- Access the Prometheus dashboard at `http://ipmaster:9090/graph` on the master.

3. Install Grafana for visualization:
   ```bash
   ./prometheus/grafana.sh
   ```

## Load Balancer Setup
1. Install Nginx:
   ```bash
   yum install nginx
   ```
2. Configure Nginx:
 ##notice ( mapping port in docker-compose.yml from 4000 to 3000 app)
   - Edit `/etc/nginx/conf.d/app.conf`:
     ```nginx
     upstream webapp {
       server serverip1;
       server serverip2;
     }
     server {
       listen 4000;
       location / {
         proxy_pass http://webapp;
       }
     }
     ```
