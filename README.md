# MentorMatch

MentorMatch is an intelligent mentorship platform designed to bridge the gap between aspiring learners and experienced professionals. By providing structured, 1-on-1, goal-oriented mentorship, the application facilitates multi-dimensional matching, session scheduling, and continuous progress tracking.

---

## ✨ Key Features

- **Role-Based Workflows:** Distinct, optimized interfaces and onboarding flows for Mentees and Mentors.
- **Intelligent Mentor Matching:** Recommends mentors based on skill gaps, domain expertise, and schedule compatibility.
- **Secure Authentication:** JWT-based authentication with robust Role-Based Access Control (RBAC) via Spring Security.
- **Session Management:** Seamless calendar booking with auto-generated third-party integration (e.g., Google Meet).
- **Progress Tracking:** Interactive goal setting, skill gap visualization, and post-session review loops.

---

## 🛠 Tech Stack

| Environment        | Technologies                                           |
| ------------------ | ------------------------------------------------------ |
| **Frontend**       | React, TypeScript, Vite, Axios                         |
| **Backend**        | Java 21, Spring Boot 3.x, Maven, Spring Security (JWT) |
| **Database**       | PostgreSQL 17                                          |
| **Infrastructure** | Docker, Docker Compose, GitHub Actions (CI/CD)         |
| **Code Quality**   | Checkstyle (Google Rules), PMD, SpotBugs, ESLint       |

---

## 🚀 Getting Started

Follow these instructions to set up the project for local development.

### Prerequisites

Ensure you have the following installed on your local machine:

- [Docker & Docker Compose](https://www.docker.com/) (Recommended)
- [Java 21 (JDK)](https://adoptium.net/)
- [Node.js 20+](https://nodejs.org/) & npm
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/GotaSeptimiuAndrei/DISS_Project.git
cd DISS_Project
```

### 2. Environment Configuration

Create the necessary `.env` files to securely store your variables. Do not commit these to version control.

**Backend (`./backend/.env`):**

```env
DB_PASSWORD=your_secure_postgres_password
JWT_SECRET=your_base64_encoded_jwt_secret_key
```

**Frontend (`./frontend/.env`):**

```env
# In a Docker environment, Vite will proxy /api requests automatically.
# Use this for external/production deployments:
# VITE_API_BASE_URL=https://api.mentormatch.com
```

### 3. Running with Docker (Recommended)

The easiest way to spin up the entire stack (Database, Backend, and Frontend) is via Docker Compose. The configuration includes health checks to ensure the database is fully ready before the Spring Boot backend initializes.

```bash
docker compose up --build -d
```

- **Frontend UI:** `http://localhost:80`
- **Backend API:** `http://localhost:8080/api`
- **Database:** `localhost:5432`

To view logs and ensure services started correctly:

```bash
docker compose logs -f
```

### 4. Running Manually (For Active Development)

If you prefer to run the applications natively for hot-reloading and easier debugging:

**Start the Database:**

```bash
docker compose up db -d
```

**Start the Backend:**

```bash
cd backend
mvn spring-boot:run
```

**Start the Frontend:**

```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Code Quality & Linting

We enforce strict static code analysis to maintain a healthy codebase. These checks are also automated via GitHub Actions on every pull request.

**Backend (Java):**
We use Checkstyle, PMD, and SpotBugs bound to the Maven `verify` phase.

```bash
cd backend
mvn clean verify
```

**Frontend (React/TS):**
We use ESLint for logic and TypeScript for strict type checking.

```bash
cd frontend
npm run lint
npm run typecheck
npx prettier --write .
```

---

## 📂 Project Structure

```text
mentormatch/
├── backend/                  # Spring Boot application
│   ├── src/main/java/        # Java source code
│   ├── src/main/resources/   # Properties, Checkstyle configs, and static assets
│   ├── pom.xml               # Maven dependencies and plugins
│   └── Dockerfile            # Backend container definition
├── frontend/                 # React frontend application
│   ├── src/                  # React components, pages, and Axios clients
│   ├── vite.config.ts        # Vite configuration and API proxy settings
│   ├── package.json          # npm scripts and dependencies
│   └── Dockerfile            # Frontend container definition
├── docker-compose.yml        # Orchestrates db, backend, and frontend
└── .github/workflows/        # CI/CD pipeline definitions
```
