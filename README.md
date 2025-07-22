# 📚 E-commerce Monorepo

 ✨ This workspace is powered by Nx – Smart Monorepos · Fast CI ✨
## 📦 Overview

This monorepo contains 3 applications:

- Client Web – Angular + PrimeNG + NGRX Signal Store
- Admin Dashboard – Vue.js + Pinia + PrimeVue
- Delivery Manager –  React + Zustand + PrimeReact
- API – NestJS + Prisma

## 🧩 Apps Description
### 🛍️ Client Web
- Built with Angular, PrimeNG, NGRX Signal Store
- A full-featured bookstore allowing users to browse and purchase books.
- The application to which I devoted the most time

#### Features:
- 📚 Browse books: sorting, filtering, and searching
- 💾 Save/load filters
- 👤 Account management: update email/password
- 🏠 Manage delivery addresses (CRUD)
- ❤️ Favorite books
- 🛒 Cart sync across devices when logged in

### 🛠️ Admin Dashboard
- Built with Vue.js, Pinia, PrimeVue, and PrimeForms
- An administrative panel to manage the bookstore.

#### Features:
- 📚 Book management
- 🏷️ Category management
- 📍 Country management
- 👥 User management
- 🏢 Publisher management
- 🚚 Shipping methd management

### 🛠️ Delivery Manager
- Built with React, Zustand and PrimeReact
- An administrative panel to manage the bookstore.

#### Features:
- 📚 Book management
- 🏷️ Category management
- 🚚 Order manager
- 📦 Inventory control: add/change quantity
- 🔄 Order status management

### 🔌 API
- Built with NestJS, Prisma
- Serves both front-end applications
- Includes integrated Swagger documentation

#### Features:
- ✉️ Email sending
- 📘 Swagger UI for API documentation

## 🗂️ Libraries Structure
- data-access – HTTP calls, state management (stores)
- feature – Smart components
- ui – Dumb/presentational components
- utils – Utility/helper functions
- shell – Entry points that compose domain features

## 🛠️ Tech Stack
- Nx (monorepo tool)
- Angular, Vue.js
- NGRX Signal Store, Pinia
- NestJS, Prisma
- Tailwind CSS, Prime UI
- Electron
- Supabase Storage
- Bun

🚀 Getting Started
1. Install Bun

```bash
curl -fsSL https://bun.sh/install | bash
```

2. Create .env file

Copy .env.example and fill in your credentials.

3. Install Dependencies

```bash
bun install
```

4. Generate Prisma Client

```bash
cd apps/api
bunx prisma generate
```

5. Migrate Database

```bash
bunx prisma migrate dev --name init
```

6. Run All Apps in Dev Mode

```bash
bunx nx run-many -t serve -p client-web admin-dashboard delivery-manager api
```
- Client Web: http://localhost:4200
- Admin Dashboard: http://localhost:4201
- Delivery Manager: http://localhost:4202
- API: http://localhost:3000/api

## 💡 Useful Commands
### Run individual apps

#### Client Web
```bash
bunx nx serve client-web
```

#### Admin Dashboard
```bash
bunx nx serve admin-dashboard
```

#### Delivery Manager
```bash
bunx nx serve delivery-manager
```

#### API
```bash
bunx nx serve api
```

### Run Admin Dashboard in Electron

```bash
bunx nx electron admin-dashboard
```

### Build any app

```bash
bunx nx build <project-name>
```

### View Project Graph

```bash
bunx nx graph
```
