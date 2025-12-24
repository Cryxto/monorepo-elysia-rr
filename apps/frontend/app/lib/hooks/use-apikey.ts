import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiKeyApi } from "../api/apikey"
import type { CreateApiKey, UpdateApiKey } from "../api/apikey"
import { toast } from "sonner"

export function useApiKeys() {
  return useQuery({
    queryKey: ["apikeys"],
    queryFn: () => apiKeyApi.list(),
  })
}

export function useCreateApiKey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateApiKey) => apiKeyApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apikeys"] })
      toast.success("API Key created successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create API key")
    },
  })
}

export function useUpdateApiKey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateApiKey) => apiKeyApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apikeys"] })
      toast.success("API Key updated successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update API key")
    },
  })
}

export function useDeleteApiKey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (keyId: string) => apiKeyApi.delete(keyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apikeys"] })
      toast.success("API Key deleted successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete API key")
    },
  })
}
