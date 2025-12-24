# Authentication Implementation Guide

This document describes the authentication system implemented in Monorepo with ElysiaJs and React Router project.

## Overview

The project uses **Better Auth** for authentication, with:
- Backend: Elysia server with Better Auth (email/password, API keys, bearer tokens)
- Frontend: React Router v7 with Better Auth React client
- All routes are CSR (Client-Side Rendering)

## Backend Setup

### Auth Configuration

Location: `apps/backend/src/infrastructures/better-auth/auth.config.ts`

```typescript
import { betterAuth } from 'better-auth';
import { admin, apiKey, bearer, openAPI } from 'better-auth/plugins';

export const auth = betterAuth({
  database: new Database('auth.db'),
  basePath: '/auth',
  plugins: [openAPI(), bearer(), apiKey(), admin()],
  emailAndPassword: { enabled: true },
  session: {
    preserveSessionInDatabase: true,
    storeSessionInDatabase: true,
  },
});
```

### Available Backend Endpoints

All auth endpoints are prefixed with `/api/auth`:

- `POST /api/auth/sign-up/email` - Register new user
- `POST /api/auth/sign-in/email` - Login with email/password
- `GET /api/auth/get-session` - Get current user session
- `POST /api/auth/sign-out` - Logout user
- `POST /api/auth/forget-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/verify-email` - Verify email with token
- `POST /api/auth/send-verification-email` - Resend verification email

### Default Admin User

On first run, a default admin user is created:
- Email: from `DEFAULT_ADMIN_EMAIL` env variable
- Password: from `DEFAULT_ADMIN_PASSWORD` env variable
- Role: `admin`

Location: `apps/backend/src/index.ts:23-34`

## Frontend Setup

### Auth Client Configuration

Location: `apps/frontend/app/lib/auth.ts`

```typescript
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
})

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  forgetPassword,
  resetPassword,
} = authClient
```

### Routes Configuration

Location: `apps/frontend/app/routes.ts`

All routes are configured as CSR (Client-Side Rendering) routes:

```typescript
export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("signup", "routes/signup.tsx"),
  route("forgot-password", "routes/forgot-password.tsx"),
  route("reset-password", "routes/reset-password.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
] satisfies RouteConfig;
```

Each route file exports a `clientLoader()` function to ensure CSR:

```typescript
export function clientLoader() {
  return null
}
```

### UI Components

#### 1. Login Form
**Location:** `apps/frontend/app/components/login-form.tsx`

Features:
- Email and password fields
- Loading states
- Error handling with toast notifications
- Link to forgot password page
- Link to signup page
- Redirects to `/dashboard` on success

#### 2. Signup Form
**Location:** `apps/frontend/app/components/signup-form.tsx`

Features:
- Name, email, password, and confirm password fields
- Client-side password validation (min 8 characters)
- Password matching validation
- Loading states
- Error handling with toast notifications
- Link to login page
- Redirects to `/dashboard` on success

#### 3. Forgot Password Form
**Location:** `apps/frontend/app/components/forgot-password-form.tsx`

Features:
- Email input field
- Sends password reset email
- Success message with email confirmation
- Link back to login page

#### 4. Reset Password Form
**Location:** `apps/frontend/app/components/reset-password-form.tsx`

Features:
- New password and confirm password fields
- Token validation from URL query parameter
- Handles invalid/expired tokens
- Redirects to forgot password on error
- Redirects to login on success

#### 5. Protected Route Component
**Location:** `apps/frontend/app/components/protected-route.tsx`

A wrapper component that:
- Checks if user is authenticated using `useSession()`
- Shows loading spinner while checking session
- Redirects to `/login` if not authenticated
- Renders children if authenticated

Usage:
```tsx
<ProtectedRoute>
  <YourProtectedContent />
</ProtectedRoute>
```

#### 6. Nav User Component
**Location:** `apps/frontend/app/components/nav-user.tsx`

Features:
- Displays current user's name, email, and avatar
- User initials fallback if no avatar
- Dropdown menu with user options
- Logout functionality with confirmation toast
- Automatically pulls session data from `useSession()`

### Toast Notifications

The app uses `sonner` for toast notifications. The `<Toaster />` component is added to the root layout.

**Location:** `apps/frontend/app/root.tsx:38`

## Usage Examples

### Login

```typescript
import { signIn } from "@/lib/auth"
import { toast } from "sonner"

const handleLogin = async (email: string, password: string) => {
  const result = await signIn.email({
    email,
    password,
    callbackURL: "/dashboard",
  })

  if (result.error) {
    toast.error(result.error.message)
  } else {
    toast.success("Signed in successfully!")
  }
}
```

### Signup

```typescript
import { signUp } from "@/lib/auth"
import { toast } from "sonner"

const handleSignup = async (name: string, email: string, password: string) => {
  const result = await signUp.email({
    name,
    email,
    password,
    callbackURL: "/dashboard",
  })

  if (result.error) {
    toast.error(result.error.message)
  } else {
    toast.success("Account created successfully!")
  }
}
```

### Get Current Session

```typescript
import { useSession } from "@/lib/auth"

function MyComponent() {
  const { data: session, isPending } = useSession()

  if (isPending) return <div>Loading...</div>
  if (!session) return <div>Not logged in</div>

  return <div>Hello {session.user.name}!</div>
}
```

### Logout

```typescript
import { signOut } from "@/lib/auth"
import { toast } from "sonner"
import { useNavigate } from "react-router"

const navigate = useNavigate()

const handleLogout = async () => {
  await signOut()
  toast.success("Logged out successfully")
  navigate("/login")
}
```

### Forgot Password

```typescript
import { forgetPassword } from "@/lib/auth"
import { toast } from "sonner"

const handleForgotPassword = async (email: string) => {
  const result = await forgetPassword({
    email,
    redirectTo: window.location.origin + "/reset-password",
  })

  if (result.error) {
    toast.error(result.error.message)
  } else {
    toast.success("Password reset email sent!")
  }
}
```

### Reset Password

```typescript
import { resetPassword } from "@/lib/auth"
import { toast } from "sonner"

const handleResetPassword = async (token: string, newPassword: string) => {
  const result = await resetPassword({
    newPassword,
    token,
  })

  if (result.error) {
    toast.error(result.error.message)
  } else {
    toast.success("Password reset successfully!")
  }
}
```

## Protected Routes

To protect a route, wrap it with the `<ProtectedRoute>` component:

```tsx
import { ProtectedRoute } from "@/components/protected-route"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>Protected dashboard content</div>
    </ProtectedRoute>
  )
}
```

The `dashboard.tsx` route is already protected this way.

## Styling

All auth forms use:
- Shadcn/UI components (Card, Input, Button, Label, etc.)
- Tailwind CSS for styling
- Responsive design (mobile-first)
- Loading states and disabled states during async operations

## Error Handling

All auth operations include:
- Try-catch blocks for network errors
- Error response handling from Better Auth
- User-friendly error messages via toast notifications
- Proper loading states

## Type Safety

All components use TypeScript with:
- Proper type imports from React Router (`Route.ComponentProps`)
- Better Auth type inference
- Full type safety for forms and API calls

## Testing the Implementation

1. **Start the backend:**
   ```bash
   bun backend:dev
   ```

2. **Start the frontend:**
   ```bash
   bun frontend:dev
   ```

3. **Test flows:**
   - Visit `/signup` to create a new account
   - Visit `/login` to sign in
   - Visit `/forgot-password` to test password reset flow
   - Visit `/dashboard` to test protected route (should redirect if not logged in)
   - Use the user dropdown in the sidebar to test logout

## API Documentation

The full OpenAPI specification is available at:
```
http://localhost:3000/api/openapi/json
```

In production, this endpoint is protected and requires admin authentication.

## Session Management

- Sessions are stored in the SQLite database (`auth.db`)
- Sessions persist in cookies
- Session validation happens automatically via Better Auth
- The `useSession()` hook provides real-time session state

## Security Features

- Password hashing (handled by Better Auth)
- CSRF protection
- Session token security
- Email verification support
- Password reset token expiration
- Admin role-based access control

## Next Steps

Potential enhancements:
- Add OAuth providers (Google, GitHub, etc.)
- Implement email verification flow
- Add two-factor authentication
- Add user profile management
- Add password change functionality
- Add account settings page
- Add user roles and permissions UI
