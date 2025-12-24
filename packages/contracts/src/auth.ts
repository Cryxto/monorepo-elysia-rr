import { z } from 'zod';

// User schema
export const UserRoleSchema = z.enum(['admin', 'regular']);

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  emailVerified: z.boolean(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  role: UserRoleSchema.optional().nullable(),
  banned: z.boolean().optional().nullable(),
  banReason: z.string().optional().nullable(),
  banExpires: z.coerce.date().optional().nullable(),
});

// Session schema
export const SessionSchema = z.object({
  id: z.string(),
  expiresAt: z.coerce.date(),
  token: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
  userId: z.string(),
  impersonatedBy: z.string().optional().nullable(),
});

// Account schema (social connections)
export const AccountSchema = z.object({
  id: z.string(),
  accountId: z.string(),
  providerId: z.string(),
  userId: z.string(),
  accessToken: z.string().optional().nullable(),
  refreshToken: z.string().optional().nullable(),
  idToken: z.string().optional().nullable(),
  accessTokenExpiresAt: z.coerce.date().optional().nullable(),
  refreshTokenExpiresAt: z.coerce.date().optional().nullable(),
  scope: z.string().optional().nullable(),
  password: z.string().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

// API Key schema
export const ApikeySchema = z.object({
  id: z.string(),
  name: z.string(),
  start: z.string(),
  prefix: z.string(),
  key: z.string(),
  userId: z.string(),
  refillInterval: z.number().optional().nullable(),
  refillAmount: z.number().optional().nullable(),
  lastRefillAt: z.coerce.date().optional().nullable(),
  enabled: z.boolean().default(true),
  rateLimitEnabled: z.boolean().default(true),
  rateLimitTimeWindow: z.number().default(86400000),
  rateLimitMax: z.number().default(10),
  requestCount: z.number().default(0),
  remaining: z.number().optional().nullable(),
  lastRequest: z.coerce.date().optional().nullable(),
  expiresAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  permissions: z.string().optional().nullable(),
  metadata: z.string().optional().nullable(),
});

// Auth session response
export const AuthSessionSchema = z.object({
  session: SessionSchema,
  user: UserSchema,
});

// Sign in/up request schemas
export const SignInEmailSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  callbackURL: z.string().optional().nullable(),
  rememberMe: z.boolean().optional().nullable(),
});

export const SignUpEmailSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  image: z.string().optional(),
  callbackURL: z.string().optional(),
  rememberMe: z.boolean().optional(),
});

// Sign in/up response schemas
export const SignInResponseSchema = z.object({
  redirect: z.literal(false),
  token: z.string(),
  url: z.string().optional().nullable(),
  user: UserSchema,
});

export const SignUpResponseSchema = z.object({
  token: z.string().optional().nullable(),
  user: UserSchema,
});

// Update user schema
export const UpdateUserSchema = z.object({
  name: z.string().optional(),
  image: z.string().optional().nullable(),
});

export const UpdateUserResponseSchema = z.object({
  user: UserSchema,
});

// Change password schema
export const ChangePasswordSchema = z.object({
  newPassword: z.string().min(6),
  currentPassword: z.string().min(6),
  revokeOtherSessions: z.boolean().optional().nullable(),
});

export const ChangePasswordResponseSchema = z.object({
  token: z.string().optional().nullable(),
  user: UserSchema,
});

// Change email schema
export const ChangeEmailSchema = z.object({
  newEmail: z.string().email(),
  callbackURL: z.string().optional().nullable(),
});

export const ChangeEmailResponseSchema = z.object({
  user: UserSchema.optional(),
  status: z.boolean(),
  message: z.enum(['Email updated', 'Verification email sent']).optional().nullable(),
});

// Reset password schema
export const ResetPasswordSchema = z.object({
  newPassword: z.string().min(6),
  token: z.string().optional().nullable(),
});

export const ResetPasswordResponseSchema = z.object({
  status: z.boolean(),
});

// Forget password schema
export const ForgetPasswordSchema = z.object({
  email: z.string().email(),
  callbackURL: z.string().optional(),
});

export const ForgetPasswordResponseSchema = z.object({
  status: z.boolean(),
});

// Verify email schema
export const VerifyEmailSchema = z.object({
  token: z.string(),
  callbackURL: z.string().optional(),
});

export const VerifyEmailResponseSchema = z.object({
  user: UserSchema,
  status: z.boolean(),
});

// Send verification email schema
export const SendVerificationEmailSchema = z.object({
  email: z.string().email(),
  callbackURL: z.string().optional().nullable(),
});

export const SendVerificationEmailResponseSchema = z.object({
  status: z.boolean(),
});

// Delete user schema
export const DeleteUserSchema = z.object({
  callbackURL: z.string().optional(),
  password: z.string().optional(),
  token: z.string().optional(),
});

export const DeleteUserResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
});

// Sign out response
export const SignOutResponseSchema = z.object({
  success: z.boolean(),
});

// Get session response
export const GetSessionResponseSchema = z.nullable(AuthSessionSchema);

// Create API Key schema
export const CreateApikeySchema = z.object({
  name: z.string().min(1),
  expiresIn: z.number().optional(),
  permissions: z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  rateLimitMax: z.number().optional(),
  rateLimitTimeWindow: z.number().optional(),
});

// Update API Key schema
export const UpdateApikeySchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  enabled: z.boolean().optional(),
  rateLimitEnabled: z.boolean().optional(),
  rateLimitMax: z.number().optional(),
  rateLimitTimeWindow: z.number().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

// List API Keys response
export const ListApikeysResponseSchema = z.object({
  data: z.array(ApikeySchema),
  total: z.number(),
});

// List Sessions response
export const ListSessionsResponseSchema = z.object({
  data: z.array(SessionSchema),
  total: z.number(),
});

// List Accounts response
export const ListAccountsResponseSchema = z.object({
  data: z.array(AccountSchema),
  total: z.number(),
});

// Delete session schema
export const DeleteSessionSchema = z.object({
  id: z.string(),
});

export const DeleteSessionResponseSchema = z.object({
  success: z.boolean(),
});

// Social sign in schema
export const SocialSignInSchema = z.object({
  provider: z.string(),
  callbackURL: z.string().optional().nullable(),
  newUserCallbackURL: z.string().optional().nullable(),
  errorCallbackURL: z.string().optional().nullable(),
  disableRedirect: z.boolean().optional().nullable(),
  scopes: z.array(z.string()).optional().nullable(),
  requestSignUp: z.boolean().optional().nullable(),
  loginHint: z.string().optional().nullable(),
  additionalData: z.string().optional().nullable(),
});

// Invitation schema
export const InvitationSchema = z.object({
  invitee: z.string().email(),
});

export const InvitationResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
});

// Types
export type UserRole = z.infer<typeof UserRoleSchema>;
export type User = z.infer<typeof UserSchema>;
export type Session = z.infer<typeof SessionSchema>;
export type Account = z.infer<typeof AccountSchema>;
export type Apikey = z.infer<typeof ApikeySchema>;
export type AuthSession = z.infer<typeof AuthSessionSchema>;

export type SignInEmail = z.infer<typeof SignInEmailSchema>;
export type SignUpEmail = z.infer<typeof SignUpEmailSchema>;
export type SignInResponse = z.infer<typeof SignInResponseSchema>;
export type SignUpResponse = z.infer<typeof SignUpResponseSchema>;

export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type UpdateUserResponse = z.infer<typeof UpdateUserResponseSchema>;

export type ChangePassword = z.infer<typeof ChangePasswordSchema>;
export type ChangePasswordResponse = z.infer<typeof ChangePasswordResponseSchema>;

export type ChangeEmail = z.infer<typeof ChangeEmailSchema>;
export type ChangeEmailResponse = z.infer<typeof ChangeEmailResponseSchema>;

export type ResetPassword = z.infer<typeof ResetPasswordSchema>;
export type ResetPasswordResponse = z.infer<typeof ResetPasswordResponseSchema>;

export type ForgetPassword = z.infer<typeof ForgetPasswordSchema>;
export type ForgetPasswordResponse = z.infer<typeof ForgetPasswordResponseSchema>;

export type VerifyEmail = z.infer<typeof VerifyEmailSchema>;
export type VerifyEmailResponse = z.infer<typeof VerifyEmailResponseSchema>;

export type SendVerificationEmail = z.infer<typeof SendVerificationEmailSchema>;
export type SendVerificationEmailResponse = z.infer<typeof SendVerificationEmailResponseSchema>;

export type DeleteUser = z.infer<typeof DeleteUserSchema>;
export type DeleteUserResponse = z.infer<typeof DeleteUserResponseSchema>;

export type SignOutResponse = z.infer<typeof SignOutResponseSchema>;
export type GetSessionResponse = z.infer<typeof GetSessionResponseSchema>;

export type CreateApikey = z.infer<typeof CreateApikeySchema>;
export type UpdateApikey = z.infer<typeof UpdateApikeySchema>;
export type ListApikeysResponse = z.infer<typeof ListApikeysResponseSchema>;
export type ListSessionsResponse = z.infer<typeof ListSessionsResponseSchema>;
export type ListAccountsResponse = z.infer<typeof ListAccountsResponseSchema>;

export type DeleteSession = z.infer<typeof DeleteSessionSchema>;
export type DeleteSessionResponse = z.infer<typeof DeleteSessionResponseSchema>;

export type SocialSignIn = z.infer<typeof SocialSignInSchema>;
export type Invitation = z.infer<typeof InvitationSchema>;
export type InvitationResponse = z.infer<typeof InvitationResponseSchema>;
