# TaskTrack — Full-Stack Task Manager

A secured REST API with a React frontend for managing personal tasks. Built as part of the DevOrbis AI Internship, Week 1 project.

**Live App:** https://tasktrack-frontend-aune.onrender.com
**Live API:** https://tasktrack-v1w1.onrender.com

## Features

- User registration and login with hashed passwords (bcrypt) and JWT authentication
- Full CRUD for tasks (title, description, status, due date), scoped to the logged-in user
- Protected API routes using auth middleware
- React frontend with login/register pages, task list, create/edit/delete, and loading/error states

## Tech Stack

**Backend:** Node.js, Express, MongoDB Atlas, Mongoose, bcrypt, jsonwebtoken, cors
**Frontend:** React (Vite)
**Deployment:** Render (backend web service + frontend static site)

## Project Structure
