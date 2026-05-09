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

<details>
<summary><strong>POST /addSchool</strong></summary>

Adds a new school to the database.

---

##### ✅ Success - Add Standard School
**Request Body:**
```json
{
  "name": "Springfield High",
  "address": "123 Evergreen Terrace, Springfield",
  "latitude": 39.7817,
  "longitude": -89.6501
}
```
**Response:** `201 Created`

---

##### ✅ Success - Extreme Coordinates
Demonstrates that coordinates at the edge of the valid range are accepted.
**Request Body:**
```json
{
  "name": "Polar Research Academy",
  "address": "Antarctica Base Camp",
  "latitude": -90.0,
  "longitude": 180.0
}
```
**Response:** `201 Created`

---

##### ❌ Error - School Already Exists
Attempting to add a school with a name and address that already exists.
**Response:** `409 Conflict`

---

##### ❌ Error - Invalid Coordinates Out of Bounds
**Request Body:**
```json
{
  "name": "Impossible School",
  "address": "Nowhere",
  "latitude": 150.0,
  "longitude": -200.0
}
```
**Response:** `400 Bad Request` with an error message like `"Latitude must be between -90 and 90"`.

---

##### ❌ Error - Missing Address and Coordinates
**Request Body:**
```json
{
  "name": "Ghost School"
}
```
**Response:** `400 Bad Request` with a list of missing fields.

</details>

<br>

<details>
<summary><strong>GET /listSchools</strong></summary>

Retrieves a list of all schools, sorted by the nearest distance to the user's provided coordinates.

---

##### ✅ Success - List Schools
**Request:** `GET /listSchools?latitude=19.1075&longitude=72.8370`
**Response:** `200 OK` with a sorted list of schools and their distances.

---

##### ❌ Error - Missing Latitude and Longitude Parameter
**Request:** `GET /listSchools?latitude=19.1075`
**Response:** `400 Bad Request` with an error message like `"User longitude is required to calculate proximity"`.

---

##### ❌ Error - Invalid Data Type
**Request:** `GET /listSchools?latitude=abc&longitude=xyz`
**Response:** `400 Bad Request` with an error message like `"Latitude must be a valid number"`.

---

##### ❌ Error - Latitude Restrictions
**Request:** `GET /listSchools?latitude=100&longitude=72`
**Response:** `400 Bad Request` with an error message like `"Latitude must be between -90 and 90"`.

</details>