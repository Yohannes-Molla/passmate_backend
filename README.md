# Exam Preparation App Backend

This is the backend server for the Exam Preparation application.

## Setup

1. Install dependencies:
   ```
   cd server
   npm install
   ```

2. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## Available Scripts

- `npm run dev`: Starts the development server with hot-reloading
- `npm run build`: Builds the TypeScript code into JavaScript
- `npm start`: Runs the built application in production mode
- `npm run lint`: Lints the code using ESLint

## API Endpoints

### Testing
- `GET /api/ping`: Simple endpoint to check if the API is working

### Exams
- `GET /api/exam`: Get all available exams
- `GET /api/exam/:id`: Get a specific exam by ID
- `GET /api/exam/:id/questions`: Get questions for a specific exam
- `POST /api/exam/submit`: Submit exam results

### Users
- `POST /api/user/login`: User login
- `POST /api/user/register`: User registration
- `GET /api/user/:id`: Get user profile
- `PUT /api/user/:id`: Update user profile
- `GET /api/user/:id/progress`: Get user progress

### Statistics
- `GET /api/stats/user/:userId`: Get user statistics
- `GET /api/stats/user/:userId/exam/:examId`: Get exam statistics for a user
- `GET /api/stats/user/:userId/category/:category`: Get category statistics for a user

### Practice
- `GET /api/practice/user/:userId`: Get practice sessions for a user
- `GET /api/practice/:id`: Get specific practice session
- `POST /api/practice`: Create new practice session
- `POST /api/practice/:id/submit`: Submit practice results
- `GET /api/practice/:id/questions`: Get questions for a specific practice session

## Directory Structure

```
server/
├── src/
│   ├── controllers/         # Request handlers
│   ├── data/                # Mock data (would be DB in production)
│   ├── routes/              # API route definitions
│   ├── types/               # TypeScript interfaces and types
│   └── index.ts             # Entry point
├── .env                     # Environment variables
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── .gitignore               # Git ignore file
```
