# Overview

This is a bilingual (English/Arabic) recipe management web application called "Family Nesting". The application allows users to browse, search, filter, add, edit, and view detailed information about recipes with family-based synchronization. It features a comprehensive recipe system with support for ingredients, cooking instructions, tools, ratings, images, video links, cultural information, and email-based family sync where the app name dynamically changes to "(Family Name) Nesting" when users join a family group.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent design
- **Styling**: Tailwind CSS with custom CSS variables for theming and RTL/LTR support
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Internationalization**: Custom context-based i18n system supporting English and Arabic with RTL layout support

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with CRUD operations for recipes
- **Validation**: Zod schemas for request/response validation
- **Development**: In-memory storage for development with interface for easy database migration

## Data Storage
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Database**: PostgreSQL (configured via Neon Database)
- **Schema**: Comprehensive recipe schema with bilingual support
- **Session Management**: Connect-pg-simple for PostgreSQL session storage

## Key Features
- **Bilingual Support**: Complete Arabic and English localization with RTL/LTR layout switching
- **Recipe Management**: Full CRUD operations with rich metadata including ratings, categories, and cultural information
- **Search & Filtering**: Advanced search by name, ingredients, country, serving temperature, and category
- **Media Support**: Image galleries and video links for cooking instructions
- **Responsive Design**: Mobile-first approach with adaptive layouts

## Database Schema
The recipe schema includes:
- Bilingual text fields (name, description, instructions in both English and Arabic)
- Structured ingredient lists with amounts
- Tool requirements
- Cultural metadata (country, serving temperature)
- Rating system
- Media attachments (images, video URLs)
- Categorization and timestamps

# External Dependencies

## Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form, TanStack Query
- **UI Framework**: Radix UI components, shadcn/ui, Tailwind CSS
- **Build Tools**: Vite, TypeScript, PostCSS, Autoprefixer

## Backend Dependencies
- **Server**: Express.js, Node.js TypeScript execution (tsx)
- **Database**: Drizzle ORM, Neon Database serverless PostgreSQL
- **Validation**: Zod for schema validation
- **Session**: Connect-pg-simple for session management

## Development Tools
- **Replit Integration**: Vite plugins for Replit development environment
- **Icons**: Lucide React for consistent iconography
- **Utilities**: clsx, class-variance-authority for styling utilities
- **Date Handling**: date-fns for date manipulation

## Production Considerations
- **Bundle Output**: Separate client (Vite) and server (esbuild) build processes
- **Static Assets**: Vite handles client-side assets, Express serves the built application
- **Environment**: NODE_ENV-based configuration for development/production modes