# YouTube Backend

A YouTube-like backend API built with **Node.js, Express.js, MongoDB, and Mongoose**.

This project is being developed to understand backend development by building real-world features such as authentication, user management, file uploads, Cloudinary integration, MongoDB aggregation, and protected routes.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Token)
- bcrypt
- Cloudinary
- Multer
- Cookie Parser
- CORS
- dotenv
- Mongoose Aggregate Paginate

## Dependencies

| Package | Purpose |
|---|---|
| `express` | Backend server and API routes |
| `mongoose` | MongoDB database interaction |
| `bcrypt` | Password hashing |
| `jsonwebtoken` | Access and refresh token generation |
| `cookie-parser` | Reading cookies from requests |
| `cors` | Handling cross-origin requests |
| `dotenv` | Loading environment variables |
| `cloudinary` | Cloud file/image storage |
| `multer` | Handling file uploads |
| `mongoose-aggregate-paginate-v2` | Pagination for aggregation results |

## Features

- User registration
- User login
- User logout
- JWT-based authentication
- Access token and refresh token system
- HTTP-only cookies
- Password hashing using bcrypt
- Protected routes
- User profile/channel information
- Avatar upload
- Cover image upload
- File upload handling with Multer
- Cloudinary integration
- MongoDB and Mongoose
- User watch history
- MongoDB aggregation pipelines
- `$lookup` for related data
- Nested `$lookup`
- `$project` and `$addFields`
- Aggregation pagination
- Input validation
- Custom API errors
- Custom API responses
- Async error handling

## Project Structure

```text
src/
├── controllers/
│   └── user.controllers.js
│
├── middlewares/
│   ├── auth.middleware.js
│   └── multer.middleware.js
│
├── models/
│   └── user.models.js
│
├── routes/
│   └── user.routes.js
│
├── utils/
│   ├── ApiError.js
│   ├── ApiResponse.js
│   ├── asyncHandler.js
│   ├── cloudinary.js
│   └── ...
│
└── validators/
    └── user.validator.js
```

> The exact project structure may contain additional files as development continues.

## Authentication

The project uses **JWT (JSON Web Tokens)** for authentication.

Two types of tokens are used:

### Access Token

The access token is a short-lived JWT used to authenticate requests to protected routes.

It contains information such as:

- User ID
- Email
- Username
- Full name

### Refresh Token

The refresh token has a longer lifetime and is used to obtain a new access token.

The refresh token is also stored in the user's database record so that it can be invalidated during logout.

### Authentication Flow

```text
User Login
    ↓
Check username/email
    ↓
Check password
    ↓
Generate Access Token
    ↓
Generate Refresh Token
    ↓
Store Refresh Token in Database
    ↓
Send Tokens to Client
```

## JWT Protected Routes

Protected routes use JWT middleware.

The middleware:

1. Reads the access token from the cookie or `Authorization` header.
2. Verifies the JWT using the access token secret.
3. Gets the user's ID from the decoded token.
4. Finds the user in MongoDB.
5. Removes sensitive fields such as password and refresh token from the returned user.
6. Stores the authenticated user in `req.user`.
7. Calls `next()` so the controller can continue.

Conceptually:

```text
Request
   ↓
JWT Middleware
   ↓
Token valid?
   ├── No → 401 Unauthorized
   │
   └── Yes
         ↓
      Find User
         ↓
      req.user
         ↓
      Controller
```

## Logout

Logout is a protected route.

During logout:

1. The authenticated user is identified using `req.user`.
2. The refresh token is removed from the database.
3. The access token cookie is cleared.
4. The refresh token cookie is cleared.

This makes the stored refresh token invalid for future authentication flows.

## Password Security

Passwords are never stored as plain text.

Before saving a user, the password is hashed using **bcrypt**.

```text
Plain Password
      ↓
    bcrypt
      ↓
Password Hash
      ↓
   MongoDB
```

When logging in, bcrypt compares the entered password with the stored hash.

## File Uploads

The project uses **Multer** for handling file uploads.

The basic flow is:

```text
Client
  ↓
Multer
  ↓
Temporary Local File
  ↓
Cloudinary
  ↓
Cloud Storage
```

Multer temporarily stores uploaded files locally.

Cloudinary then stores the uploaded file in the cloud.

After the Cloudinary upload process, the temporary local file is removed.

## Cloudinary

Cloudinary is used for storing uploaded media such as:

- Avatar
- Cover image
- Other uploaded files

This prevents the application server from having to permanently store uploaded media locally.

## MongoDB and Mongoose

MongoDB is used as the database and Mongoose is used as the ODM.

The User model contains fields such as:

- `username`
- `email`
- `fullname`
- `avatar`
- `coverImage`
- `watchHistory`
- `password`
- `refreshToken`

### Watch History

The `watchHistory` field contains references to videos.

Conceptually:

```text
User
  ↓
watchHistory
  ↓
Video IDs
  ↓
Videos Collection
```

## MongoDB Aggregation

MongoDB aggregation pipelines are used to retrieve, filter, join, and transform data.

An aggregation pipeline works as a sequence of stages:

```text
Document
   ↓
Stage 1
   ↓
Stage 2
   ↓
Stage 3
   ↓
Final Result
```

Aggregation returns an **array of documents**.

### `$lookup`

`$lookup` is used to retrieve related documents from another collection.

For watch history:

```text
User
  ↓
watchHistory (Video IDs)
  ↓
$lookup
  ↓
Videos Collection
  ↓
Actual Video Documents
```

### Nested `$lookup`

A video may contain an `owner` field that references a user.

Therefore, the data relationship can be:

```text
User
  ↓
Watch History
  ↓
Video
  ↓
Video Owner
```

The first `$lookup` gets the videos.

The nested `$lookup` gets information about the owner of each video.

### `$project`

`$project` controls which fields appear in the aggregation result.

For example, an owner document can be reduced to:

- `fullname`
- `username`
- `avatar`

### `$addFields`

`$addFields` adds or modifies fields in the documents flowing through the aggregation pipeline.

It does not permanently modify the original MongoDB document unless stages such as `$out` or `$merge` are used.

For example, a lookup may return:

```text
owner: [
    { fullname, username, avatar }
]
```

If only one owner is expected, `$first` can be used to convert it into a single object:

```text
owner: {
    fullname,
    username,
    avatar
}
```

## API Error Handling

The project uses a custom `ApiError` utility for consistent error responses.

Example situations:

- Missing required fields
- Invalid credentials
- Unauthorized requests
- User not found
- Invalid access token
- File upload errors

## API Responses

The project uses a custom `ApiResponse` utility to keep successful API responses consistent.

A typical response contains:

- HTTP status code
- Data
- Message

## Async Error Handling

The project uses an `asyncHandler` utility for asynchronous Express controllers.

Its purpose is to catch rejected promises from async controllers and pass the error to Express error-handling middleware.

Conceptually:

```text
Request
   ↓
asyncHandler
   ↓
Async Controller
   ↓
Success → Response

Error
   ↓
next(error)
   ↓
Error Handler
```

## Validation

User input is validated before creating or processing a user.

Validation includes checks such as:

- Required fields
- Email format
- Username format
- Full name format
- Password length
- Password complexity

This helps prevent invalid data from entering the database.

## Environment Variables

Create a `.env` file in the project root.

Example:

```env
PORT=8000

MONGODB_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=your_access_token_expiry

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=your_refresh_token_expiry

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**Never commit real secrets or your `.env` file to GitHub.**

Add `.env` to `.gitignore`.

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

## Running the Project

Start the development server:

```bash
npm run dev
```

The exact command depends on the scripts defined in `package.json`.

## Testing APIs

APIs can be tested using tools such as:

- Postman
- Thunder Client
- Frontend application

For file uploads, use `multipart/form-data`.

Typical registration fields include:

```text
fullname
username
email
password
avatar
coverImage
```

`avatar` is required, while `coverImage` can be optional depending on the API implementation.

## API Route Example

A protected route can use middleware before the controller:

```text
POST /logout
       ↓
verifyJWT middleware
       ↓
logoutUser controller
```

For channel information, a dynamic route can be used:

```text
/c/:username
```

Here `:username` is an Express route parameter.

For example:

```text
/c/shadow
```

means:

```text
req.params.username = "shadow"
```

## Learning Goals

This project is being built to understand backend development practically.

Main concepts covered:

- Node.js
- Express.js
- REST APIs
- Routing
- Middleware
- Request and response objects
- MongoDB
- Mongoose
- MongoDB aggregation
- `$lookup`
- Nested `$lookup`
- `$project`
- `$addFields`
- JWT authentication
- Access and refresh tokens
- Cookies
- Password hashing
- Multer
- Cloudinary
- Input validation
- Error handling
- Pagination

## Project Status

🚧 **In Development**

This project is being developed incrementally while learning backend development and building a practical YouTube-like backend API.
