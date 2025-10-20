# Full Stack Order Management System

This is a simple order management system built as a technical challenge. It includes a RESTful backend API built with Node.js, Express, and MongoDB, and a client application built with Vue 3. The entire project is containerized with Docker for easy setup and development.

This project is structured as a monorepo using npm workspaces to share TypeScript types between the frontend and backend.

## Tech Stack

- **Backend**: Node.js, Express, TypeScript, MongoDB (with Mongoose)
- **Frontend**: Vue 3, TypeScript, Vite, Axios
- **Shared**: Shared TypeScript types for full end-to-end type safety.
- **Containerization**: Docker & Docker Compose
- **Code Quality**: ESLint & Prettier

## Features

- **CRUD Operations** for orders.
- **Paginated** list of orders.
- **Filter** orders by status (`pending`, `completed`, `cancelled`).
- **End-to-end Type Safety** with a shared types package.
- **Containerized** for one-command setup.
- **Responsive UI** with loading and error states.

---

## Prerequisites

- Docker
- Docker Compose
- Node.js (for installing dependencies locally)

---

## Getting Started

1.  **Clone the repository**
    ```sh
    git clone https://github.com/nazabucciarelli/fullstack-ts-challenge
    cd fullstack-ts-challenge
    ```

2.  **Install dependencies**
    Run this command from the root directory to install dependencies for all workspaces (backend, frontend, shared).
    ```sh
    npm install
    ```

3.  **Run the application with Docker Compose**
    From the root directory, run the following command:
    ```sh
    docker-compose up --build
    ```
    This command will build the Docker images for the frontend and backend, and start all the necessary services (backend, frontend, database).

4.  **Access the application**
    -   **Frontend UI**: Open your browser and navigate to [http://localhost:8080](http://localhost:8080)
    -   **Backend API**: The API is running at `http://localhost:3000`. You can access endpoints like `http://localhost:3000/api/orders`.

---

## API Endpoints

The API is prefixed with `/api`.

| Method | Endpoint               | Description                                           |
| :----- | :--------------------- | :---------------------------------------------------- |
| `POST` | `/orders`              | Create a new order.                                   |
| `GET`  | `/orders`              | Get a paginated list of orders.                       |
| `GET`  | `/orders/:id`          | Get a single order by its ID.                         |
| `PUT`  | `/orders/:id`          | Update an existing order.                             |
| `DELETE`| `/orders/:id`          | Delete an order.                                      |

### Query Parameters for `GET /orders`

-   `page` (number, default: 1): The page number to retrieve.
-   `page_size` (number, default: 10): The number of items per page.
-   `status` (string): Filter orders by status (`pending`, `completed`, `cancelled`).
