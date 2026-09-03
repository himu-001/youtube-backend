# 🎥 Video Hosting Backend

A backend application for a video hosting platform inspired by YouTube. This project is being built while learning and implementing modern backend development practices using Node.js, Express.js, MongoDB, and Mongoose.

> 🚧 This project is currently under development.

---

## 📖 About The Project

This project focuses on building a complete backend for a video hosting platform.

The backend handles core functionality such as user authentication, video management, comments, likes, subscriptions, and token-based authentication.

The project follows a structured backend architecture and focuses on implementing real-world backend concepts.

---

## ✨ Features

- User registration and login
- Authentication and authorization
- Access Token and Refresh Token authentication
- Secure password hashing using bcrypt
- Video upload and management
- Video thumbnails
- Video publishing
- View tracking
- Likes and dislikes
- Comments
- Channel subscriptions and unsubscriptions
- User profile management
- MongoDB aggregation pipelines
- Pagination using `mongoose-aggregate-paginate-v2`
- Centralized error handling
- Structured API responses

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcrypt
- Cloudinary
- Multer
- mongoose-aggregate-paginate-v2

---

## 📂 Project Structure

```text
src/
│
├── controllers/
├── models/
├── routes/
├── middlewares/
├── utils/
├── db/
│
├── app.js
└── index.js