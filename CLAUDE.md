# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Casa Latina Ping Pong Club - A React + TypeScript web application for managing a ping pong club in San Cristóbal de las Casas, Chiapas. The app handles events, tournaments, member registrations, and player statistics.

**Tech Stack:**
- React 18 with TypeScript
- Vite for build tooling
- TailwindCSS for styling (with custom Chiapas color palette)
- Supabase for authentication and database
- Lucide React for icons

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run ESLint
npm run lint

# Type checking
npm run typecheck

# Preview production build
npm run preview
```

## Environment Setup

The app requires Supabase environment variables in a `.env` file:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

Supabase client is configured in `src/lib/supabase.ts`.

## Architecture

### Application Structure

**Navigation Model:** The app uses a single-page application pattern with a `currentSection` state in `App.tsx`. Navigation between sections (home, events, leaderboard, tournaments, auth, register, admin) is handled by the `Navbar` component updating this state.

**Auth Flow:**
- `AuthProvider` wraps the entire app and manages Supabase auth state
- On auth state change, automatically loads the user's profile from the `profiles` table
- Three user roles: `admin`, `member`, `guest`
- New users default to `guest` role; admin status must be manually set in Supabase (see SETUP_ADMIN.md)

### Key Components

- **App.tsx** - Main layout router, renders different sections based on `currentSection` state
- **Navbar** - Navigation header, conditionally shows "Admin" button only for admin role users
- **AdminDashboard** - Admin-only panel with tabs for managing events, tournaments, and members
- **AuthContext** - Global auth state, provides `useAuth()` hook with user, profile, and auth methods

### Database Schema (Supabase)

**Tables with RLS enabled:**
- `profiles` - User profiles with role (admin/member/guest), linked to auth.users
- `members` - Club membership applications and status (active/inactive/pending)
- `events` - Club events (training, tournament, social, documentary, other)
- `tournaments` - Tournament management
- `players` - Player statistics (ranking points, matches, win rate)
- `matches` - Match records between players
- `tournament_participants` - Tournament registrations

**Security Model:**
- Public read access for events, tournaments, players, and matches
- Only admins can create/edit/delete events and tournaments
- Users can register as members (creates row in `members` table)
- Admins can update any member's status via AdminDashboard

### Styling

Custom Tailwind theme defined in `tailwind.config.js` with Chiapas-inspired colors:
- `chiapas-blue` (#1B5E9F), `chiapas-blue-dark`, `chiapas-blue-light`
- `chiapas-jade` (#10B981), `chiapas-teal` (#14B8A6)
- `chiapas-orange` (#F97316), `chiapas-red`, `chiapas-yellow`

Custom animations in `src/index.css`: ping-pong-bounce, float, paddle-swing, etc.

## Admin Setup

To grant admin privileges:
1. User creates account through the app (becomes `guest` role)
2. Manually update the `role` field in the `profiles` table to `admin` via Supabase dashboard or SQL

See `SETUP_ADMIN.md` for detailed instructions.

## Type Definitions

All TypeScript interfaces are centralized in `src/types/index.ts`:
- `Profile`, `Member`, `Event`, `Tournament`, `Player`, `Match`, `TournamentParticipant`

## Key Implementation Notes

- The app uses Supabase's Row Level Security (RLS) - policies are defined in `supabase/migrations/`
- Admin checks are done via `profile?.role === 'admin'` throughout the UI
- Date formatting uses `es-MX` locale for Spanish language display
- Member registration creates a new member but defaults to `pending` status; admin must approve to `active`
