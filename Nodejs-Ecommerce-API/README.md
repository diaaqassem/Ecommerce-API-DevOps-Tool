<p align="center">
  <a href="https://nodejs.org/en/" target="blank"><img src="https://th.bing.com/th/id/R.d42672d4d185739d26257ed5c653c740?rik=dvh0VB%2fEWz20hQ&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fnodejs-logo-png-nice-images-collection-node-js-desktop-wallpapers-370.png&ehk=bMmyN3n62enzXql6L4A5EzHc90tJxK%2bKcr6GMACTfRk%3d&risl=&pid=ImgRaw&r=0" width="200" alt="Node.js Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nodejs/node/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nodejs/node

<p align="center">A fast, unopinionated, and minimalist <a href="https://nodejs.org/en/" target="_blank">Node.js</a> framework for building web applications and APIs with <a href="https://expressjs.com/" target="_blank">Express</a>.</p>
<p align="center">
<a href="https://www.npmjs.com/package/express" target="_blank"><img src="https://img.shields.io/npm/v/express.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/package/express" target="_blank"><img src="https://img.shields.io/npm/l/express.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/package/express" target="_blank"><img src="https://img.shields.io/npm/dm/express.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nodejs/node" target="_blank"><img src="https://img.shields.io/circleci/build/github/nodejs/node/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nodejs/node?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nodejs/node/badge.svg?branch=master" alt="Coverage" /></a>
<a href="https://discord.gg/nodejs" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/expressjs#backer" target="_blank"><img src="https://opencollective.com/expressjs/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/expressjs#sponsor" target="_blank"><img src="https://opencollective.com/expressjs/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
<a href="https://paypal.me/nodejs" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
<a href="https://opencollective.com/expressjs#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
<a href="https://twitter.com/nodejs" target="_blank"><img src="https://img.shields.io/twitter/follow/nodejs.svg?style=social&label=Follow"></a>
</p>






# Nodejs-Ecommerce-API
This E-Commerce API built with Node.js and Express with more features 

# E-Commerce API

This is a comprehensive E-Commerce API built using Node.js and Express. It supports user authentication, product management, cart functionality, order processing, and payment options (credit card or cash on delivery). Additionally, the platform offers roles for administrators and managers to manage products and brands, with advanced security features like password reset.

## Features
- User Authentication: Users can register, log in, reset passwords, and update profiles.
- Product Management: Admins and managers can create, update, delete, and view products and brands.
- Cart and Orders: Users can add products to their cart, place orders, and choose to pay by card (via Stripe) or cash on delivery.
- Role-Based Access Control: Admins, managers, and regular users have different permissions.
- Password Reset: Users can reset their password via email using **Nodemailer** and **Mailgun**.
- Secure API: Data sanitization, rate limiting, and other security measures implemented.

## Technologies Used
- Node.js & **Express**: For the backend API.
- MongoDB& Mongoose: For the NoSQL database and ORM.
- JWT: For user authentication.
- Stripe: For online payments via credit card.
- Multer& Sharp: For handling file uploads and image processing.
- Nodemailer & Mailgun: For email services, such as password reset.
- ESLint: For maintaining code quality and style consistency.
- bcryptjs: For hashing and verifying passwords securely.
- colors: Adds colors to the console for easier debugging.
- compression: Compresses HTTP responses to improve performance.
- cors: Enables Cross-Origin Resource Sharing for the API.
- dotenv: Loads environment variables from a .env file.
- express: Web framework for building the API server.
- express-async-handler: Handles async errors in Express routes.
- express-mongo-sanitize: Prevents NoSQL injection by sanitizing MongoDB queries.
- express-rate-limit: Limits repeated requests to prevent brute-force attacks.
- express-validator: Middleware for validating user input in API routes.
- hpp: Protects against HTTP Parameter Pollution attacks.
- mailgun-js: Legacy Mailgun API client for sending emails.
- mailgun.js: Modern Mailgun API client for sending transactional emails.
- morgan: HTTP request logger for monitoring API requests.
- netlify-cli: Netlify command-line tool for deployment and serverless functions.
- netlify-lambda: For running Lambda functions in a Netlify environmen
- serverless-http: Utility to run Express.js apps in serverless environments.
- sharp: Image processing library for resizing and optimizing images.
- slugify: Converts strings into URL-friendly slugs.
- stripe: Handles payments via Stripe API for credit card transactions.
- uuid: Generates unique IDs for resources and transactions.
- xss-clean: Sanitizes user input to prevent XSS (Cross-Site Scripting) attacks.

## Getting Started

### Prerequisites
- Node.js (v20.9.0 or higher)
- MongoDB (local or cloud)
- Stripe account for handling payments

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/diaaqassem/Nodejs-Ecommerce-API.git
   cd Nodejs-Ecommerce-API

## create .env file
PORT = 3000
NODE_ENV =''

#database
- DB_NAME = nodejs-ecommerce-API-v1
- DB_USER = username
- DB_PASSWORD = yourpassword
- DB_URI = "databaseuri"
- BASE_URL = "http://localhost:3000/"

#jwt
- JWT_SECRET = ""
- JWT_EXPIRES_IN = "7d"

#email nodemailer
- EMAIL_HOST= 'youremail@hotmail.com'
- EMAIL_PASSWORD="yourpassword"
- EMAIL_PORT=587
- EMAIL_USE_TLS=T

# stripe settings
- STRIPE_SECRET_KEY = 

2.Install dependencies:
  npm install

3.Start the development server:
  npm run start:dev

