import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("signup", "routes/signup.tsx"),
  route("forgot-password", "routes/forgot-password.tsx"),
  route("reset-password", "routes/reset-password.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("settings", "routes/settings.tsx"),
  route("users", "routes/users.tsx"),
  route("api-keys", "routes/api-keys.tsx"),
  route("invitations", "routes/invitations.tsx"),
] satisfies RouteConfig;
