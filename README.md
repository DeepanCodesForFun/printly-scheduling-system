# Printly Scheduling System

## Overview

Printly Scheduling System is a modern, enterprise-grade print management and scheduling platform designed to streamline print order submissions, order management, and print queue orchestration for academic or business settings. It features robust integration with Supabase for real-time data synchronization, a scalable front-end built with React and TypeScript, and a highly modular architecture supporting future extensibility. 

## Architecture

- **Frontend**:  
  - React (with TypeScript) using Vite for fast builds and HMR.
  - UI layer built on shadcn-ui, Tailwind CSS, and Radix primitives for accessibility and rapid prototyping.
  - Framer Motion for page transitions and UI animations.
  - React Query for data fetching and cache management.
  - Routing via React Router v6.

- **Backend/Data Layer**:  
  - Supabase as the main backend-as-a-service (BaaS) for authentication, real-time database, and storage.
  - Database models include print orders, print files, file groups, configs, and completed orders.
  - Real-time updates via Postgres changes & Supabase Channels.

- **DevOps & Tooling**:  
  - TypeScript-first codebase with strict linting via ESLint (typescript-eslint, react-hooks, react-refresh).
  - Modular code structure with barrel exports for service domains.
  - Vite config uses module aliasing and environment-based plugin injection.

## Data Model (Supabase/Postgres)

- **completed_orders**: Tracks completed print jobs, linked to students and orders.
- **print_orders**: Central entity for each print request, includes status, student details, payment, and timestamps.
- **print_configs**: Per-order configuration (color, copies, sides).
- **print_file_groups**: Batches files by configuration (grouped for merging and cover page generation).
- **print_files**: Metadata for each uploaded document (name, size, type, config, page count, storage path).

Relationships are enforced between tables (e.g., print_files references print_orders by order_id).

## Key Features

- **Order Submission**:  
  - Users (students/staff) can submit print orders with custom configurations (color, sides, copies).
  - Multiple files per order, with grouping by configuration.

- **Queue Management**:  
  - Real-time queue updates for staff with subscription to print order changes.
  - Batch processing and merging of files (including cover page generation).
  - Status transitions: active, completed, archived.

- **Realtime Synchronization**:  
  - Live updates via Supabase channels—ensures UIs reflect current queue/order state without manual refresh.

- **API/Service Layer**:  
  - Modular service exports for printOrder domain: createOrder, getOrders, queue management, real-time subscriptions, and utility functions.
  - Integration utilities for PDF processing (e.g., cover page creation, file merging).

- **Authentication & Authorization**:  
  - Supabase authentication (email/password, OAuth providers as configured).
  - Role-based access at the application and database level.

## Setup Instructions

### Prerequisites

- Node.js (>=18) and npm
- Supabase project (with credentials and storage bucket set up)
- [Optional] nvm for Node management

### Local Development

```sh
# 1. Clone the repository
git clone https://github.com/DeepanCodesForFun/printly-scheduling-system.git

# 2. Navigate to the project directory
cd printly-scheduling-system

# 3. Install dependencies
npm install

# 4. Configure environment variables
cp .env.example .env
# Edit .env with your Supabase credentials, storage, and config

# 5. Start the development server
npm run dev
```

### Production Deployment

- Build the production bundle:  
  ```sh
  npm run build
  ```
- Serve with any static server (e.g., Vercel, Netlify, or a custom Node server).
- Ensure Supabase credentials and endpoints are set via environment variables in production.

## Folder Structure

- `src/components`: Reusable UI components, layout primitives, and page transitions.
- `src/services/printOrder`: All logic for order creation, retrieval, queue management, and real-time updates.
- `src/integrations/supabase`: Supabase client and strongly typed database models.
- `src/utils`: Utility functions (e.g., PDF merging, cover page generation).
- `public/` and `index.html`: Vite entry point and static assets.

## API/Service Usage

- **Creating an Order**:  
  Use `createOrder` service with order config and file metadata.
- **Real-time Queue Subscription**:  
  Use `subscribeToOrders(callback)` to get live updates as queue changes.
- **PDF Utilities**:  
  Use `pdfMergeUtils` for file merging and cover page creation.

## Security & Compliance

- All user data and file metadata are stored securely in Supabase with strict row-level security.
- File uploads are validated client- and server-side.
- Environment variables are required for all sensitive configuration.

## Contribution Guidelines

- Adhere to TypeScript strict mode.
- All new features must include test coverage.
- Code style is enforced by ESLint and Prettier.
- Submit pull requests with detailed descriptions and reference related issues.
- For database schema changes, update Supabase migrations and type definitions.

## License

This project is licensed for enterprise/internal use. See LICENSE file for details.
