# DensityReportingToolFrontend

# Dependencies

## Commitlint

- Ensures commit messages follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format.

## lint-staged

- Runs linters and formatters on staged files only (files added but not yet committed).
- Works with ESLint (enforces code correctness and quality) and Prettier (code style) before committing.

## ESLint

- A static code checker for JavaScript and TypeScript.
- Detects errors, bad practices, and enforces consistent coding standards.

## Husky

Automates scripts using Git hooks.

In this project:

- pre-commit: runs lint-staged to format staged files with Prettier and check code with ESLint.
- commit-msg: validates commit messages to ensure they follow Conventional Commit standards.

# Setup

### 1. clone the repository

```bash
git clone https://github.com/Density-Reporting-Tool/DensityReportingToolFrontend.git
```

### 2. Install Dependencies

Use npm ci for consistency based on package-lock.json

```bash
cd DensityReportingToolFrontend
npm ci
```

### 3. Verify linters and Commit Hooks

get the latest version of husky

```bash
npm install husky@latest --save-dev
npx husky install
```

### 4. Run the development server

```bash
npm run dev
```
