# GreenCo AI-Powered Sustainability Rating & Certification Platform

An enterprise SaaS application engineered to help manufacturing facilities record sustainability metrics, upload audit evidence files, scan files via AI OCR, and manage certification levels.

---

## 🚀 Tech Stack

*   **Backend**: Java 21, Spring Boot 3.3.5, Spring Security, Spring Data JPA, JWT
*   **Frontend**: React 19, Vite, Tailwind CSS, TanStack Query, Recharts, Zustand
*   **Database**: MySQL 8.x
*   **Caching & Broker**: Redis, RabbitMQ
*   **Object Storage**: MinIO (S3-compatible)
*   **Deployment**: Docker, Docker Compose, Nginx

---

## 🛠️ Local Installation & Run Guide

### 1. Database Setup
1. Create a MySQL database schema named `greenco_db`.
2. Seed the schema structure and metadata records using the SQL files:
   - [database_schema.sql](file:///c:/Users/gayat/OneDrive/Desktop/GreenCo-AI-Platform/database_schema.sql)
   - [database_seed.sql](file:///c:/Users/gayat/OneDrive/Desktop/GreenCo-AI-Platform/database_seed.sql)

### 2. Run Backend
1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Build and launch the Spring Boot app:
   ```bash
   mvn clean install -DskipTests
   mvn spring-boot:run
   ```

### 3. Run Frontend
1. Navigate to the frontend directory:
   ```bash
   cd Frontend
   ```
2. Install packages and start the Vite dev server:
   ```bash
   npm install
   ```
   ```bash
   npm run dev
   ```

---

## 🐳 Docker Compose Deployment
To run the entire ecosystem (MySQL, Redis, MinIO, RabbitMQ, Java API, Nginx/React UI proxy) in containerized isolation, execute:
```bash
docker-compose up --build
```

---

## 🔐 Seed User Credentials
*   **System Admin**:
    *   **Email**: `admin@greenco.org`
    *   **Password**: `AdminPass123!`
*   **Factory Operator**:
    *   **Email**: `factory@steelcorp.com`
    *   **Password**: `FactoryPass123!`
