# LearnRight

## Current State
Admin dashboard at `/admin` uses Internet Identity for auth. Access control checks `isCallerAdmin()` which calls `AccessControl.isAdmin`. The only way to become admin is via `_initializeAccessControlWithSecret` using a `CAFFEINE_ADMIN_TOKEN` env variable -- there is no self-service admin claim flow. The admin page shows "Access Denied" for any logged-in user who isn't already admin.

## Requested Changes (Diff)

### Add
- Backend: `isAdminAssigned(): async Bool` query function to check if any admin exists yet
- Backend: `claimFirstAdmin(): async ()` function that sets the caller as admin only if no admin has been assigned yet (anonymous callers rejected)
- Frontend hook: `useIsAdminAssigned` query hook
- Frontend hook: `useClaimFirstAdmin` mutation hook
- AdminPage: "First-time setup" screen shown when user is logged in, not admin, and no admin assigned -- with a single "Claim Admin Access" button
- AdminPage: Login prompt when user is not logged in

### Modify
- AdminPage: Replace plain "Access Denied" with context-aware screen (login prompt vs claim admin vs truly denied)

### Remove
Nothing removed.

## Implementation Plan
1. Add `isAdminAssigned` and `claimFirstAdmin` to `main.mo`
2. Add hooks in `useQueries.ts`
3. Update `AdminPage.tsx` to handle the three states: not logged in, first-time setup, access denied
