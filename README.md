# School Management API

[![Deploy to Render](https://api.render.com/deploy/badge?repo=SiddhantLahoti/school-management-api)](https://render.com)

A robust and scalable Node.js and Express API for managing school data. The primary feature is the ability to list schools sorted by geographical proximity to a user, calculated efficiently using the Haversine formula directly within the database.

This project is built with a focus on code quality, validation, performance, and developer experience, featuring automated testing and interactive documentation.

---

## 🌐 Live Demo

The API is deployed on Render and is publicly accessible.

- **Base URL**: [`https://school-management-api-zmem.onrender.com`](https://school-management-api-zmem.onrender.com)
- **Interactive API Docs (Swagger)**: `https://school-management-api-zmem.onrender.com/api-docs`

---

## ✨ Key Features

- **Add Schools**: Endpoint to add new schools with name, address, and geographic coordinates.
- **Proximity-Based Listing**: Lists all schools sorted by the nearest distance from a user's location.
- **Accurate Distance Calculation**: Uses the **Haversine formula** in the SQL query for precise spherical distance calculation.
- **Robust Validation**: Employs **Zod** for strict, schema-based validation on all incoming request data.
- **Duplicate Prevention**: The API intelligently prevents the creation of duplicate schools (based on name and address), returning a `409 Conflict` status.
- **Interactive API Documentation**: Includes a **Swagger UI** page for easy, browser-based API exploration and testing.
- **Database Optimization**: Utilizes a composite `INDEX` on latitude and longitude columns to ensure fast location-based queries.
- **Comprehensive Testing**: A full suite of unit and integration tests built with **Jest** and **Supertest** to ensure reliability.
- **Professional Error Handling**: Centralized error handling middleware provides clear and consistent error responses.

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL (with `mysql2` driver)
- **Validation**: Zod
- **Testing**: Jest, Supertest
- **API Documentation**: Swagger UI, `swagger-jsdoc`
- **Environment**: `dotenv`

---

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- Node.js (v18 or later recommended)
- A running MySQL server

### 1. Clone the Repository

```bash
git clone https://github.com/SiddhantLahoti/school-management-api.git
cd school-manager
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root of the project and populate it with your MySQL database credentials.

```env
# .env
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=school_db
PORT=8000
```

### 4. Set Up the Database

Connect to your MySQL instance and execute the SQL commands in the `schema.sql` file. This script will:
1. Create the `school_db` database.
2. Create the `schools` table with the required schema and indexes.
3. Insert 5 sample schools in Mumbai for immediate testing.

### 5. Run the Application

- **For development (with auto-reload via `nodemon`):**
  ```bash
  npm run dev
  ```
- **For production:**
  ```bash
  npm start
  ```

The server will start on the port specified in your `.env` file (e.g., `http://localhost:8000`).

---

## 🧪 Testing

To run the complete test suite, use the following command:

```bash
npm test
```

---

## 📖 API Documentation

### Interactive Swagger UI

Once the server is running locally, you can access the interactive Swagger UI documentation in your browser to test all endpoints live.

**Local URL**: `http://localhost:8000/api-docs`

### Endpoints

#### `POST /addSchool`

Adds a new school to the database.

**Request Body:**
```json
{
  "name": "Springfield High",
  "address": "123 Evergreen Terrace, Springfield",
  "latitude": 39.7817,
  "longitude": -89.6501
}
```
**Responses:**
- `201 Created`: If the school is added successfully.
- `400 Bad Request`: If validation fails (e.g., missing fields, invalid coordinates).
- `409 Conflict`: If a school with the same name and address already exists.

#### `GET /listSchools`

Retrieves a list of all schools, sorted by the nearest distance to the user's provided coordinates.

**Query Parameters:**
- `latitude` (number, **required**): The user's latitude.
- `longitude` (number, **required**): The user's longitude.

**Example Request:**
`GET /listSchools?latitude=19.1075&longitude=72.8370`

**Responses:**
- `200 OK`: Returns a sorted list of schools with calculated distances.
- `400 Bad Request`: If `latitude` or `longitude` are missing or invalid.