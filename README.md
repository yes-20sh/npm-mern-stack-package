```text
  ███╗   ███╗███████╗██████╗ ███╗   ██╗
  ████╗ ████║██╔════╝██╔══██╗████╗  ██║
  ██╔████╔██║█████╗  ██████╔╝██╔██╗ ██║
  ██║╚██╔╝██║██╔══╝  ██╔══██╗██║╚██╗██║
  ██║ ╚═╝ ██║███████╗██║  ██║██║ ╚████║
  ╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝
  @yes20sh/create-mern-stack-app
  React + Vite + TailwindCSS + Express + MongoDB
  Created by Yashraj Singh Solanki <yes20sh@outlook.com>
```

# @yes20sh/create-mern-stack-app

[![npm version](https://img.shields.io/npm/v/@yes20sh/create-mern-stack-app.svg?color=cb3837&style=flat-square)](https://www.npmjs.com/package/@yes20sh/create-mern-stack-app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg?style=flat-square)](https://nodejs.org/)

A modern, production-grade **MERN (MongoDB, Express, React, Node.js)** starter package and CLI generator. Scaffold a clean, robust, and scalable full-stack application with React 18, Vite, TailwindCSS v4, shadcn UI, Express, and MongoDB in seconds.

---

## Quick Start

Generate a new MERN application instantly using `npx`:

```bash
npx @yes20sh/create-mern-stack-app my-mern-app
```

Or using `npm create`:

```bash
npm create @yes20sh/mern-stack-app my-mern-app
```

Navigate into the generated project and start developing:

```bash
cd my-mern-app
npm run dev
```

- **Frontend (React + Vite):** [http://localhost:5173](http://localhost:5173)
- **Backend (Express API):** [http://localhost:5000](http://localhost:5000)
- **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## Features & Architecture Highlights

### Frontend (`/web`)
- **React 18 + Vite** – Lightning-fast HMR and optimized production bundling.
- **TailwindCSS v4 & shadcn UI** – Pre-configured modern styling system with clean UI primitives (Button, Badge, etc.).
- **React Router 6** – Declarative client-side routing.
- **Configured Axios Client** – Ready-to-use API instance with baseURL and credential handling.
- **Pre-built Custom Hooks** – Includes `useHealth` hook for server status checking.

### Backend (`/api`)
- **Modular Express Architecture** – Clean separation of concerns:
  - `controllers/` – Request handling & response serialization.
  - `services/` – Core business logic.
  - `routes/` – Modular route definitions (`/api/health`, `/api/users`).
  - `models/` – Mongoose database schemas (User model included).
  - `middleware/` – Centralized error handler and CORS setup.
  - `config/` – Resilient MongoDB connection handling with graceful fallback.
- **Developer Experience** – Nodemon live reload and clean Morgan HTTP logging.

### Monorepo Orchestration
- **Concurrently** – Run frontend and backend servers concurrently with a single command (`npm run dev`).
- **Automated Environment Setup** – Automatically configures `.env` from `.env.example` templates during scaffolding.
- **Zero-Dependency Interactive CLI** – Beautiful banner, interactive prompts, and validation.

---

## CLI Options & Flags

| Flag | Shorthand | Description | Default |
|---|---|---|---|
| `--install` | `-i` | Automatically installs dependencies for root, API, and web | Prompted |
| `--no-install` | | Skips dependency installation | False |
| `--yes` | `-y` | Accepts all default options non-interactively | False |
| `--version` | `-v` | Outputs current CLI version | |
| `--help` | `-h` | Displays CLI usage instructions | |

### Automated Non-Interactive Example
```bash
npx @yes20sh/create-mern-stack-app my-app --install -y
```

---

## Scaffolding Structure

```text
my-mern-app/
├── api/                           # Express Backend
│   ├── src/
│   │   ├── config/                # Database connection & configurations
│   │   │   └── db.js              # Resilient MongoDB connector
│   │   ├── controllers/           # HTTP Request handlers
│   │   │   ├── healthController.js
│   │   │   └── userController.js
│   │   ├── middleware/            # Custom middlewares
│   │   │   └── errorMiddleware.js # Global error handler
│   │   ├── models/                # Mongoose database models
│   │   │   └── User.js            # User schema
│   │   ├── routes/                # Express router endpoints
│   │   │   ├── healthRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   └── index.js           # Route aggregator
│   │   ├── services/              # Business logic layer
│   │   │   ├── healthService.js
│   │   │   └── userService.js
│   │   ├── app.js                 # Express application setup
│   │   └── server.js              # Server entry point
│   ├── .env                       # Backend environment variables
│   ├── .env.example               # Example backend environment variables
│   ├── .gitignore
│   └── package.json
│
├── web/                           # React + Vite Frontend
│   ├── src/
│   │   ├── api/                   # Axios client & custom hooks
│   │   │   ├── axios.js           # Configured Axios instance
│   │   │   └── health.js          # Health check API hook
│   │   ├── components/            # Reusable UI components & shadcn UI
│   │   │   └── ui/
│   │   │       ├── badge.jsx
│   │   │       └── button.jsx
│   │   ├── pages/                 # React page views
│   │   │   └── Home.jsx           # Landing page
│   │   ├── App.jsx                # Router & root layout
│   │   ├── index.css              # Global styles & Tailwind
│   │   └── main.jsx               # React DOM entry point
│   ├── .env                       # Frontend environment variables
│   ├── .env.example               # Example frontend environment variables
│   ├── vite.config.js             # Vite configuration
│   ├── components.json            # shadcn UI configuration
│   ├── .gitignore
│   └── package.json
│
├── package.json                   # Root monorepo orchestration
├── .gitignore
└── README.md
```

---

## Environment Variables

### Backend (`api/.env`)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/my-mern-app
NODE_ENV=development
WEB_URL=http://localhost:5173
```

### Frontend (`web/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Available Scripts (In Generated Project)

Inside your generated project, you can run:

| Command | Description |
|---|---|
| `npm run dev` | Runs both backend (port 5000) and frontend (port 5173) concurrently |
| `npm run dev:api` | Starts only the Express API with nodemon |
| `npm run dev:web` | Starts only the Vite React development server |
| `npm run build` | Builds the React frontend for production (`web/dist`) |
| `npm run start` | Runs the production API server |
| `npm run install:all` | Installs dependencies for root, `api/`, and `web/` |

---

## Author

**Yashraj Singh Solanki**
- Email: [yes20sh@outlook.com](mailto:yes20sh@outlook.com)
- GitHub: [@yes-20sh](https://github.com/yes-20sh)
- npm: [@yes20sh](https://www.npmjs.com/~yes20sh)

---

## License

This project is licensed under the [MIT License](LICENSE).
