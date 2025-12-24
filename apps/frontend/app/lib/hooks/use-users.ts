import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  listUsers,
  setUserRole,
  banUser,
  unbanUser,
  removeUser,
  type ListUsersParams,
  type SetUserRoleParams,
  type BanUserParams,
  type UnbanUserParams,
  type RemoveUserParams,
} from "@/lib/api/users"
import { toast } from "sonner"

export function useUsers(params?: ListUsersParams) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => listUsers(params),
  })
}

export function useSetUserRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: SetUserRoleParams) => setUserRole(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast.success("User role updated successfully")
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update user role")
    },
  })
}

export function useBanUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: BanUserParams) => banUser(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast.success("User banned successfully")
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to ban user")
    },
  })
}

export function useUnbanUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: UnbanUserParams) => unbanUser(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast.success("User unbanned successfully")
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to unban user")
    },
  })
}

export function useRemoveUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: RemoveUserParams) => removeUser(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast.success("User removed successfully")
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to remove user")
    },
  })
}
