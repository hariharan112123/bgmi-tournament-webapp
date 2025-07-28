# BGMI Pro Tournament Management Platform

## Overview

This is a comprehensive BGMI (Battlegrounds Mobile India) esports tournament management platform built as a full-stack web application. The system enables tournament creation, team management, match control, live streaming integration, and player rankings for competitive BGMI gaming.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with clear separation between client and server:

- **Frontend**: React-based SPA with TypeScript
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit OAuth integration
- **Styling**: Tailwind CSS with shadcn/ui components
- **Build Tool**: Vite for frontend bundling

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom BGMI-themed color scheme
- **Build System**: Vite with hot module replacement

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Passport.js with OpenID Connect (Replit OAuth)
- **Session Management**: PostgreSQL-backed sessions with connect-pg-simple

### Database Schema
The application uses PostgreSQL with a comprehensive schema including:
- **Users**: Player profiles with stats and admin roles
- **Tournaments**: Tournament metadata with modes (Solo/Duo/Squad)
- **Teams**: Team management with member relationships
- **Matches**: Match tracking with results and replays
- **Chat**: Real-time match communication
- **Sessions**: OAuth session storage (required for Replit Auth)

### Authentication System
- **Provider**: Replit OAuth using OpenID Connect
- **Session Storage**: PostgreSQL-backed sessions
- **Authorization**: Role-based access control (admin/user)
- **Security**: HTTP-only cookies with secure flags

## Data Flow

1. **Authentication Flow**: Users authenticate via Replit OAuth, sessions stored in PostgreSQL
2. **Tournament Management**: Admins create tournaments, users register teams
3. **Team Formation**: Users create/join teams, send invitations
4. **Match Execution**: Live match control with real-time updates
5. **Results Tracking**: Match results feed into ranking systems
6. **Replay System**: Match replays stored and made available for viewing

## External Dependencies

### Database
- **PostgreSQL**: Primary database using Neon serverless
- **Connection**: WebSocket-based connection for serverless compatibility

### Authentication
- **Replit OAuth**: Primary authentication provider
- **OpenID Connect**: Authentication protocol implementation

### UI/Styling
- **Radix UI**: Accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library

### Development Tools
- **Vite**: Build tool with HMR and development server
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Fast JavaScript bundler for production builds

## Deployment Strategy

The application is designed for deployment on Replit with the following characteristics:

- **Development Mode**: Vite dev server with Express backend
- **Production Build**: Static assets served by Express
- **Database**: Neon PostgreSQL for serverless compatibility
- **Environment Variables**: Database URL and OAuth credentials required
- **Session Storage**: PostgreSQL-backed sessions for horizontal scaling

The build process creates optimized client bundles while the server runs as a single Node.js process serving both API routes and static assets.