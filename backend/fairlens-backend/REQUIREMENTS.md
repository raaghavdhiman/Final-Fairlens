# FairLens Requirements

FairLens is a government tender transparency platform designed to enhance accountability and efficiency in public procurement processes. This document outlines the technical requirements for setting up and running the FairLens backend, built with NestJS and TypeScript.

## 1. System Requirements

- **Node.js**: Version 18.x or higher (LTS recommended)
- **npm**: Version 8.x or higher (comes with Node.js)
- **PostgreSQL**: Version 13.x or higher
- **Operating System**: Windows, macOS, or Linux (Windows 11 tested)

## 2. Backend Dependencies

The following are the key dependencies used in the FairLens backend, with brief explanations:

### Core Framework
- **@nestjs/common, @nestjs/core, @nestjs/platform-express**: NestJS framework for building scalable server-side applications with TypeScript support.

### Database and ORM
- **@prisma/client**: Prisma client for type-safe database access.
- **prisma**: Prisma CLI for database migrations and schema management.

### Authentication and Security
- **@nestjs/jwt**: JWT utilities for NestJS, enabling token-based authentication.
- **@nestjs/passport**: Passport integration for NestJS, supporting various authentication strategies.
- **passport, passport-jwt**: Passport library and JWT strategy for handling authentication.
- **bcrypt**: Library for hashing passwords securely.
- **@types/bcrypt, @types/passport-jwt**: TypeScript type definitions for bcrypt and passport-jwt.

### Utilities
- **reflect-metadata**: Enables metadata reflection for decorators.
- **rxjs**: Reactive programming library used by NestJS for handling asynchronous operations.

## 3. Environment Variables Required

The following environment variables must be configured:

- **DATABASE_URL**: Connection string for PostgreSQL database (e.g., `postgresql://username:password@localhost:5432/fairlens_db`)
- **JWT_SECRET**: Secret key for signing JWT tokens (use a strong, random string)
- **JWT_EXPIRES_IN**: Token expiration time (e.g., `1h` or `3600s`)

Set these in a `.env` file in the project root.

## 4. Database Requirements

- **PostgreSQL Database**: A dedicated database instance for FairLens.
- **Schema**: Managed via Prisma migrations. Key entities include:
  - Users (with roles: GOVERNMENT, CONTRACTOR, PUBLIC)
  - Tenders (with statuses: DRAFT, OPEN, CLOSED, AWARDED, CANCELLED)
  - Bids, Milestones, and Audit Logs
- **Migrations**: Run Prisma migrations to set up the initial schema and apply updates.

## 5. Security Requirements

- **Authentication**: JWT-based with Passport strategy.
- **Authorization**: Role-Based Access Control (RBAC) with guards for GOVERNMENT, CONTRACTOR, PUBLIC, and ANONYMOUS roles.
- **Password Security**: Bcrypt hashing for user passwords.
- **Data Protection**: Ensure secure handling of sensitive data; use HTTPS in production.
- **Audit Logging**: Built-in audit logs for tracking user actions on tenders.

## 6. Future Blockchain Requirements (Optional / Later Implementation)

- **Blockchain Integration**: Planned for enhanced transparency and immutability.
- **Wallet Support**: User wallet addresses for blockchain interactions.
- **Smart Contracts**: Contract addresses for tender-related smart contracts.
- **Requirements**: Ethereum-compatible blockchain node, Web3 libraries (e.g., ethers.js), and cryptographic keys management.
- **Note**: Not currently implemented; marked for future development.

## 7. Development & Testing Tools

- **TypeScript**: For type-safe development.
- **Jest**: Testing framework for unit and integration tests.
- **ESLint**: Linting for code quality.
- **Prettier**: Code formatting.
- **Supertest**: For end-to-end API testing.
- **NestJS CLI**: For building and running the application.

## 8. How to Run the Backend Locally

Follow these steps to set up and run the FairLens backend locally:

1. **Clone the Repository**:
   ```
   git clone <repository-url>
   cd backend/fairlens-backend
   ```

2. **Install Dependencies**:
   ```
   npm install
   ```

3. **Set Up Environment Variables**:
   - Create a `.env` file in the project root.
   - Add the required environment variables (see Section 3).

4. **Set Up PostgreSQL Database**:
   - Install and start PostgreSQL.
   - Create a database for FairLens.
   - Update `DATABASE_URL` in `.env` with your database credentials.

5. **Run Database Migrations**:
   ```
   npx prisma migrate dev
   ```

6. **Generate Prisma Client**:
   ```
   npx prisma generate
   ```

7. **Start the Development Server**:
   ```
   npm run start:dev
   ```
   The server will run on `http://localhost:3000` by default.

8. **Run Tests** (Optional):
   ```
   npm run test
   ```

For production deployment, use `npm run build` to compile TypeScript and `npm run start:prod` to run the optimized build.
