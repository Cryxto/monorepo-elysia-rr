import { authClient } from "@/lib/auth"
import type { User } from "@packages/contracts"

export interface ListUsersParams {
  limit?: number
  offset?: number
  sortBy?: string
  sortDirection?: 'asc' | 'desc'
  searchValue?: string
  searchField?: 'name' | 'email'
  role?: string
  banned?: boolean
}

export interface ListUsersResponse {
  users: User[]
  total: number
}

export interface SetUserRoleParams {
  userId: string
  role: string
}

export interface BanUserParams {
  userId: string
  banReason?: string
  banExpiresIn?: number
}

export interface UnbanUserParams {
  userId: string
}

export interface RemoveUserParams {
  userId: string
}

// Use Better Auth admin client
export async function listUsers(params?: ListUsersParams): Promise<ListUsersResponse> {
  const result = await authClient.admin.listUsers({
    query: {
      limit: params?.limit,
      offset: params?.offset,
      sortBy: params?.sortBy,
      sortDirection: params?.sortDirection,
      searchValue: params?.searchValue,
      searchField: params?.searchField,
      filterField: params?.role ? 'role' as const : params?.banned !== undefined ? 'banned' as const : undefined,
      filterValue: params?.role || (params?.banned !== undefined ? String(params.banned) : undefined),
    }
  })
  return result.data as ListUsersResponse
}

export async function setUserRole(params: SetUserRoleParams) {
  const result = await authClient.admin.setRole({
    userId: params.userId,
    role: params.role as any, // Backend supports roles: admin, regular
  })
  return result.data
}

export async function banUser(params: BanUserParams) {
  const result = await authClient.admin.banUser({
    userId: params.userId,
    banReason: params.banReason,
    banExpiresIn: params.banExpiresIn,
  })
  return result.data
}

export async function unbanUser(params: UnbanUserParams) {
  const result = await authClient.admin.unbanUser({
    userId: params.userId,
  })
  return result.data
}

export async function removeUser(params: RemoveUserParams) {
  const result = await authClient.admin.removeUser({
    userId: params.userId,
  })
  return result.data
}
