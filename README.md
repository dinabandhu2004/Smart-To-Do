# Smart ToDo API

A production-ready REST API backend for managing tasks with user authentication.

## Features

- User registration and authentication using JWT
- Task CRUD operations (Create, Read, Update, Delete)
- Secure password hashing with bcrypt
- Protected routes with JWT middleware
- User-specific task access (users can only access their own tasks)
- Input validation and error handling
- MongoDB Atlas integration

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT (JSON Web Tokens)
- bcrypt
- dotenv

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   NODE_ENV=development
   MONGO_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-secret-jwt-key
   ```

4. Start the server:
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

#### Register User
- **POST** `/api/auth/register`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "User registered successfully.",
    "data": {
      "user": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "createdAt": "2024-01-01T00:00:00.000Z"
      },
      "token": "jwt_token_here"
    }
  }
  ```

#### Login User
- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Login successful.",
    "data": {
      "user": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "createdAt": "2024-01-01T00:00:00.000Z"
      },
      "token": "jwt_token_here"
    }
  }
  ```

### Tasks (Protected Routes - Require JWT Token)

All task endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

#### Create Task
- **POST** `/api/tasks`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "title": "Complete project",
    "description": "Finish the Smart ToDo API project",
    "status": "pending"
  }
  ```

#### Get All Tasks
- **GET** `/api/tasks`
- **Headers:** `Authorization: Bearer <token>`
- Returns all tasks for the authenticated user

#### Update Task
- **PUT** `/api/tasks/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "title": "Updated title",
    "description": "Updated description",
    "status": "completed"
  }
  ```
- Only the task owner can update their tasks

#### Delete Task
- **DELETE** `/api/tasks/:id`
- **Headers:** `Authorization: Bearer <token>`
- Only the task owner can delete their tasks

## Testing with Postman

1. **Register a new user:**
   - Method: POST
   - URL: `http://localhost:5000/api/auth/register`
   - Body (raw JSON):
     ```json
     {
       "name": "Test User",
       "email": "test@example.com",
       "password": "test123"
     }
     ```

2. **Login:**
   - Method: POST
   - URL: `http://localhost:5000/api/auth/login`
   - Body (raw JSON):
     ```json
     {
       "email": "test@example.com",
       "password": "test123"
     }
     ```
   - Copy the `token` from the response

3. **Create a task:**
   - Method: POST
   - URL: `http://localhost:5000/api/tasks`
   - Headers: `Authorization: Bearer <your_token>`
   - Body (raw JSON):
     ```json
     {
       "title": "My first task",
       "description": "This is a test task",
       "status": "pending"
     }
     ```

4. **Get all tasks:**
   - Method: GET
   - URL: `http://localhost:5000/api/tasks`
   - Headers: `Authorization: Bearer <your_token>`

5. **Update a task:**
   - Method: PUT
   - URL: `http://localhost:5000/api/tasks/<task_id>`
   - Headers: `Authorization: Bearer <your_token>`
   - Body (raw JSON):
     ```json
     {
       "status": "completed"
     }
     ```

6. **Delete a task:**
   - Method: DELETE
   - URL: `http://localhost:5000/api/tasks/<task_id>`
   - Headers: `Authorization: Bearer <your_token>`

## Project Structure

```
smart-todo-api/
├── src/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   ├── User.js            # User model
│   │   └── Task.js            # Task model
│   ├── routes/
│   │   ├── auth.routes.js     # Authentication routes
│   │   └── task.routes.js     # Task routes
│   ├── controllers/
│   │   ├── auth.controller.js # Auth logic
│   │   └── task.controller.js # Task CRUD logic
│   ├── middleware/
│   │   └── auth.middleware.js # JWT authentication middleware
│   ├── app.js                 # Express app configuration
│   └── server.js              # Server entry point
├── .env                       # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## Security Features

- Passwords are hashed using bcrypt before storage
- JWT tokens expire after 7 days
- Protected routes require valid JWT token
- Users can only access their own tasks
- Input validation on all endpoints
- Proper error handling with appropriate HTTP status codes

## Error Responses

All error responses follow this format:
```json
{
  "success": false,
  "message": "Error message here"
}
```


