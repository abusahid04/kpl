# Tech Stack

This document outlines the technical stack, packages, tools, and architectures used in the KPL (Kharsawan Premier League) project.

---

## 🚀 Core Framework & Language

- **[Next.js](https://nextjs.org/) (v16.2.7)**: A React framework for building fast web applications, utilizing the modern **App Router** for layout management, server actions, dynamic routing, and API routing.
- **[React](https://react.dev/) (v19.2.4)**: The core UI library used for component-based rendering.
- **[TypeScript](https://www.typescriptlang.org/) (v5.x)**: A typed superset of JavaScript providing static type checking, autocompletion, and enhanced tooling support.

---

## 🎨 Styling & UI Design

- **[Tailwind CSS](https://tailwindcss.com/) (v4.x)**: A utility-first CSS framework for rapid and responsive UI development.
- **[next-themes](https://github.com/pacocoursey/next-themes)**: Seamless dark mode and system theme synchronization.
- **[Framer Motion](https://www.framer.com/motion/) (v12.x)**: Production-ready animations and micro-interactions for a premium, dynamic feel.
- **[lucide-react](https://lucide.dev/) & [react-icons](https://react-icons.github.io/react-icons/)**: Library-independent SVG icons for a consistent and modern UI aesthetic.
- **UI Helper Utilities**:
  - `clsx` & `tailwind-merge`: For clean, conflict-free, and dynamic class merging.
  - `tailwindcss-animate`: Custom animations for utility-based UI transitions.

---

## 🗄️ Database & State Persistence

- **[SQLite](https://www.sqlite.org/)**: A local, file-based relational database (stored in `prisma/dev.db`), perfect for lightweight deployments and rapid local development.
- **[Prisma ORM](https://www.prisma.io/) (v5.22.0)**: Next-generation object-relational mapper used to model databases, run migrations, and interface securely with the SQLite database via a generated TypeScript client.

---

## 🔒 Authentication & Security

- **[NextAuth.js](https://next-auth.js.org/) (v4.24.14)**: Flexible authentication for Next.js applications.
- **[@auth/prisma-adapter](https://authjs.dev/reference/adapter/prisma)**: Connects NextAuth.js to the Prisma database schema for robust user session management.
- **[bcrypt](https://github.com/kelektiv/node.bcrypt.js) & @types/bcrypt**: Library for secure password hashing and verification.

---

## 📅 Utility Libraries

- **[date-fns](https://date-fns.org/)**: A modern helper library for parsing, validating, manipulating, and formatting dates.

---

## 📁 Key File Structure Reference

- [`prisma/schema.prisma`](file:///c:/xampp/htdocs/kpl/prisma/schema.prisma): Database models (Admin, Role, Team, Player, Match, Announcement, Gallery, Sponsor, Setting).
- [`src/app/`](file:///c:/xampp/htdocs/kpl/src/app/): Next.js App Router pages, layouts, and route handlers.
- [`src/components/`](file:///c:/xampp/htdocs/kpl/src/components/): Reusable UI components.
- [`src/lib/`](file:///c:/xampp/htdocs/kpl/src/lib/): Core library functions, including database clients and authentication config.
- [`src/actions/`](file:///c:/xampp/htdocs/kpl/src/actions/): Next.js Server Actions for handling server-side logic and database updates directly from forms.
