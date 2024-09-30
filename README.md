# Fullstack React + Express Application

This is a minimal fullstack application that uses Express for the backend and React for the frontend. It is bundled using Webpack. The frontend communicates with the backend via an API.

## Project Structure

```
project-folder/
│
├── client/                # React app folder
│   ├── public/
│   │   ├── index.html     # HTML template
│   ├── src/               # React source files
│   │   ├── App.tsx        # Main React component
│   │   ├── index.tsx      # Entry point for React
│   └── package.json       # Dependencies and scripts
│   └── tsconfig.json      # TypeScript configuration
│   └── webpack.config.js  # Webpack configuration for React
│
├── server/                # Express server folder
│   ├── src/               # Source files
│   │   ├── server.js      # Express server entry point
│   └── package.json       # Express dependencies and scripts
│   └── tsconfig.json      # TypeScript configuration
│
└── package.json           # Root package.json to manage both client and server
```

## Prerequisites

Ensure that you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) (npm is used in this guide)

## Getting Started

### 1. Install Dependencies

To install dependencies for both the client and server, run the following commands:

```bash
# Install npm-run-all globaly
npm install npm-run-all -g

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 2. Running the Application

You can run the application in development mode to launch both the client and server concurrently.

```bash
cd ..
npm run dev
```

- The **React frontend** will be running at `http://localhost:3001`
- The **Express backend** API will be running at `http://localhost:3000`

The frontend fetches data from the backend API through the `/api/hello` endpoint.

### 3. Building the Client for Production

If you want to build the React app for production, run the following command inside the `client` folder:

```bash
npm run build
```

The bundled files will be available in the `client/dist` folder.

### 4. Running Only the Server

If you'd like to run just the server (without the React frontend), navigate to the `server` directory and start the server:

```bash
cd server
npm run start
```

The server will be available at `http://localhost:3000`.

## Folder Overview

- `client`: Contains the React frontend.
- `server`: Contains the Express backend.

## API Endpoint

- `GET /api/hello`: Returns a JSON object with a `message` field saying "Hello from Flink!".

## Tasks before the live coding interview

As preparation for the live coding interview, you are asked to complete the following tasks:

### 1. Return products

Add a new endpoint `GET /api/products` that returns all available products.

Example response:

```json
[
  {
    "id": 1,
    "name": "Product A",
    "description": "Product A description",
    "price": 20
  },
  {
    "id": 2,
    "name": "Product B",
    "description": "Product B description",
    "price": 30
  }
]
```

### 2. Return a single product information

Add a new endpoint `GET /api/products/:id` that returns a single product, given its ID. If the product is not found, return a `404` error status code with a meaningful error message.

Example response:

```json
{
  "id": 1,
  "name": "Product A",
  "description": "Product A description",
  "price": 20
}
```

### Requirements

- Handle error cases, such as invalid product IDs.
- Add tests for the newly created endpoints.
- For the purpose of this task, you do not need to use an actual database; using an in-memory array to store product data is sufficient.
- Feel free you make any changes to the codebase that you consider relevant. This project will be used during the live coding interview.
- Update README file with instructions on how to set up the project after your changes (if new instructions apply).

### Deliverable

- Complete the aforementioned tasks and provide us with the updated code.
- Submit your solution 2 days after receiving the task, adding the link to the code repository, or attaching the solution to the email..
