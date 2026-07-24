# Day 2 — Node.js & Express

In-memory CRUD API built with Express, covering HTTP fundamentals, routing, middleware, and REST conventions.

## What's in this folder

- `server.js` — CRUD API for a `products` resource (GET, POST, PUT, DELETE), using an in-memory array (no database)

## Setup

```bash
npm install
node server.js
```
Runs on `http://localhost:3000`.

## Routes

| Method | Route | Description |
|---|---|---|
| GET | `/PRODUCTS` | Get all products |
| GET | `/PRODUCTS/:id` | Get one product by id |
| POST | `/PRODUCTS` | Create a new product |
| PUT | `/PRODUCTS/:id` | Update a product |
| DELETE | `/PRODUCTS/:id` | Delete a product |

Tested manually using Postman.
