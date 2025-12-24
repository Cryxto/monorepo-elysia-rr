import { createAuthClient } from "better-auth/react";
import { adminClient, apiKeyClient } from "better-auth/client/plugins";
import { createAccessControl } from "better-auth/plugins/access";
import { config } from "./config";

// Define the same permissions and resources as backend
const permissions = [
  "create",
  "share",
  "update",
  "delete",
  "read",
  "revoke",
  "invite",
  "reserve",
  "approve",
  "disapprove",
] as const;

// Create access control matching backend configuration
const access = createAccessControl({
  signup: permissions,
  docs: permissions,
  user: permissions,
  session: permissions,
  account: permissions,
  apikey: permissions,
  test: permissions,
});

// Define roles with same permissions as backend
const adminRole = access.newRole({
  signup: ["create", "read", "update", "delete", "approve", "disapprove", "invite"],
  docs: ["read"],
  user: ["create", "read", "update", "delete"],
  session: ["create", "read", "update", "delete"],
  account: ["create", "read", "update", "delete"],
  apikey: ["create", "read", "update", "delete"],
});

const regularRole = access.newRole({
  test: ["read"],
});

export const authClient = createAuthClient({
  baseURL: config.apiBaseUrl,
  plugins: [
    adminClient({
      ac: access,
      roles: {
        admin: adminRole,
        regular: regularRole,
      },
      defaultRole: "regular",
    }),
    apiKeyClient(),
  ],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  resetPassword,
  updateUser,
  changePassword,
  changeEmail,
  sendVerificationEmail,
} = authClient;