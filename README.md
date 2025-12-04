# Beach Cache Detection & Coordination System

A futuristic ops platform for coordinating beach patrol activities.

## Project Structure

This monorepo contains:

- `/backend` - FastAPI service for AI, email notifications, and orchestration
- `/web-dashboard` - React dashboard for operators and analysts
- `/mobile` - Expo React Native app for field patrols

## Tech Stack

- **Backend**: FastAPI + Supabase
- **Web Dashboard**: React, Vite, TypeScript, Tailwind CSS
- **Mobile App**: Expo React Native, TypeScript
- **Database & Auth**: Supabase (Postgres, Auth, Realtime, Storage)

## Development Setup

### Prerequisites

- Node.js 18+
- Python 3.10+
- Supabase Account
- Docker (for local development and deployment)

### Getting Started

1. Set up a Supabase project and note your project URL and API keys
2. Create environment variables (see setup instructions in each module)
3. Follow the setup instructions in each module's README

## Deployment

The system is designed to be deployed with:

- Supabase for database, auth, storage and realtime
- FastAPI backend on Linode
- Web Dashboard deployed to Linode
- Mobile app distributed via Expo

See deployment documentation for detailed instructions.
