# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server at http://localhost:8080
npm run build      # Production build
npm run lint       # ESLint check
```

No test suite is configured.

## Supabase Local Development

```bash
supabase start     # Start local Supabase at http://localhost:54323
supabase db reset  # Re-apply all migrations from scratch

# Add a new migration:
supabase migration new <migration_name>
# Edit the generated SQL, then:
supabase db reset

# Deploy to remote:
supabase link --project-ref $SUPABASE_PROJECT_REF
supabase db push
```

Credentials are stored in three places:
- `src/integrations/supabase/client.ts` — `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`
- `.mcp.json` — `PROJECT_REF` and `SUPABASE_ACCESS_TOKEN`
- `supabase/config.toml` — `project_id`

The Supabase client in `client.ts` auto-switches between `http://127.0.0.1:54321` (local) and the production URL based on `window.location.hostname`.

## Architecture

**Stack:** React 18 + TypeScript + Vite, Tailwind CSS + shadcn/ui (Radix), React Query, React Router v6, Supabase (auth, database, storage, realtime).

**Path alias:** `@/` maps to `src/`.

### App entry

`src/App.tsx` sets up the full provider tree:
`QueryClientProvider` → `TooltipProvider` → `PresenceProvider` → `BrowserRouter` → Routes

### Pages and routes

| Route | Page | Auth required |
|---|---|---|
| `/` and `/categories` | `Categories` | No |
| `/product/:id` | `ProductDetail` | No |
| `/auth` | `Auth` | No |
| `/create-listing` | `CreateListing` | Yes |
| `/create-listing/new` | `CreateListingForm` | Yes |
| `/create-listing/edit/:id` | `CreateListingForm` | Yes |
| `/profile` | `Profile` | Yes |
| `/messages` | `ConversationList` | Yes |
| `/conversation/:conversationId` | `ConversationDetail` | Yes |
| `/saved-items` | `SavedItems` | Yes |

### Data fetching hooks

All hooks live in `src/hooks/` and talk directly to Supabase:

- `useAuth` — wraps `supabase.auth`, returns `{ user, session, loading }`
- `usePublicProducts` — calls `get_public_products` RPC (supports search + sort)
- `useUserProducts` — fetches the authenticated user's own listings with first image
- `useUserSavedProducts` — fetches saved items via RPC
- `useSavedProducts` — save/unsave a product via `toggle_saved_product` and `is_product_saved` RPCs
- `useUnreadMessagesCount` — totals unread counts across all conversations via `get_user_conversations` and `get_unread_count_for_conversation` RPCs

### Realtime presence

`src/contexts/PresenceProvider.tsx` manages a Supabase Realtime channel (`global-presence`) that tracks which authenticated users are currently online. Consumed via `usePresence()` hook, primarily in `ConversationDetail` to show online indicators.

### Database schema

Core tables: `profiles`, `products`, `product_images`, `conversations`, `participants`, `messages`, `message_status`, `saved_products`.

Key relationships:
- `products` → `profiles` (seller via `user_id`)
- `product_images` → `products` (multiple images per listing)
- `conversations` → `products` (one conversation per product negotiation)
- `participants` → `conversations` + `profiles` (buyer and seller)
- `messages` → `conversations` + `profiles` (sender)
- `message_status` → `messages` + `profiles` (per-user read tracking)

All tables use RLS. Business logic (read counts, save toggles, public product listing) is encapsulated in `SECURITY DEFINER` RPC functions rather than client-side queries.

### Image handling

`src/lib/imageUtils.ts` — `resizeImage()` uses the Canvas API to resize uploaded images to max 400×400px at 0.9 quality before upload. Max file size enforced client-side at 5MB. Product images are stored in Supabase Storage.

### UI components

`src/components/ui/` — shadcn/ui primitives (do not edit these directly).
`src/components/` — app-specific components: `NavigationBar`, `HamburgerMenu`, `ProductCard`, `PublicProductCard`, `FilterSheet`.

### Pending work

Image upload in conversations is not yet implemented (noted in `README_TODO.md`).
