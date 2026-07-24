# Day 4 — React Frontend (TaskTrack UI)

React frontend for the TaskTrack app, built with Vite. Covers components, props, useState/useEffect, fetching from the Week 1 API, forms, and lifted state for auth token management.

**Live App:** https://tasktrack-frontend-aune.onrender.com

## What's in this folder

- `src/App.jsx` — Root component; holds the auth token in state, conditionally renders auth forms vs. the task dashboard
- `src/RegisterForm.jsx` — Registration form, posts to `/register`
- `src/LoginForm.jsx` — Login form, posts to `/login`, lifts the returned JWT up to `App` via `onLoginSuccess`
- `src/TaskList.jsx` — Fetches and displays the logged-in user's tasks; handles loading/error states, edit and delete
- `src/TaskForm.jsx` — Form to create a new task, reports the new task back to `TaskList` via `onTaskCreated`

## Setup

```bash
npm install
npm run dev
```
Runs on `http://localhost:5173`.

## How it connects to the backend

All components send requests to the deployed backend API:
