# Density Reporting Tool — Frontend

## Table of Contents

1. [Summary](#summary)
2. [Motivation](#motivation)
3. [Tech Stack](#tech-stack)
4. [Features](#features)
5. [Contributors](#contributors)
6. [Gallery](#gallery)
7. [Development Setup](#development-setup)

## Summary

This is an early-stage tool: a React + TypeScript Progressive Web Application (PWA) designed for civil engineering teams to manage density testing workflows. The app streamlines field technician data entry and lab admin reporting, addressing real-world pain points. We are in active collaboration with a practicing civil engineer to validate workflows and ensure the app meets real-world needs.

## Motivation

The project arose from a team member’s firsthand pain points as a field technician, aiming to digitize previously paper-based data entry workflows to reduce errors during data transfer. It streamlines real-world workflows by enabling fast, clear, and low-effort data capture while providing admin tools for managing proctors, jobs, and distribution lists.

## Features

### Field Tech Workflows

- Density shots listing and details
- Photo capture and review (`react-webcam` integration)
- Job, report, and proctor reference views

### Lab Admin Tools

- Proctor management (add/update/list)
- Job creation and dashboard views
- Distribution list manager (email distribution config)

### Mobile and Offline support

- Basic PWA setup using Workbox, enabling mobile access and offline capabilities

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **State & Data**: Zustand, React Hook Form, TanStack React Query
- **Routing**: React Router v6
- **PWA/Offline**: Workbox (precaching, routing, strategies)
- **Media**: Cloudinary SDK (`@cloudinary/react`, `@cloudinary/url-gen`), `react-webcam`
- **Code Quality**: ESLint, Prettier, Husky, lint-staged, Commitlint
- **UI**: Material UI (`@mui/material`, `@mui/icons-material`)
- **Containerization**: Docker, Docker Compose

## Contributors

- Peter Senyk
- Irene Cheung

## Gallery

_Screenshots and demo images showcasing key workflows will be added here._

## Development Setup

### Dependencies

-**Commitlint**: Ensures commit messages follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format.

-**lint-staged**: Runs linters and formatters on staged files before committing (works with ESLint and Prettier).

-**ESLint**: Static code checker for JavaScript/TypeScript that enforces code quality and standards.

-**Husky**: Automates Git hooks:

1. **pre-commit** runs lint-staged to format and check code

2. **commit-msg** validates commit messages

## Docker Development (recommended)

### 1. Clone the repository

```bash
git clone https://github.com/Density-Reporting-Tool/DensityReportingToolFrontend.git
```

### 2. Add your secret .env file

Refer to .env.example for a template

### 3. Verify linters and Commit Hooks

```bash
npm install husky@latest --save-dev
npx husky install
```

### 4. Build and run the container

```bash
docker compose up --build
```

## Local Development

### 1. Clone the repository

```bash
git clone https://github.com/Density-Reporting-Tool/DensityReportingToolFrontend.git
```

### 2. Add your secret .env file

Refer to .env.example for a template

### 3. Install Dependencies

Use npm ci for consistency based on package-lock.json

```bash
cd DensityReportingToolFrontend
npm ci
```

### 4. Verify linters and Commit Hooks

```bash
npm install husky@latest --save-dev
npx husky install
```

### 5. Run the development server

```bash
npm run dev
```
