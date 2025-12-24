import { z } from "zod"
import { authClient } from "../auth"

// API Key Schema
export const apiKeySchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  start: z.string().nullable(),
  prefix: z.string().nullable(),
  userId: z.string(),
  refillInterval: z.number().nullable(),
  refillAmount: z.number().nullable(),
  lastRefillAt: z.string().nullable(),
  enabled: z.boolean().default(true),
  rateLimitEnabled: z.boolean(),
  rateLimitTimeWindow: z.number().nullable(),
  rateLimitMax: z.number().nullable(),
  requestCount: z.number(),
  remaining: z.number().nullable(),
  lastRequest: z.string().nullable(),
  expiresAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  permissions: z.record(z.string(), z.array(z.string())).nullable() as z.ZodType<{ [key: string]: string[] } | null>,
  metadata: z.record(z.string(), z.any()).nullable(),
})

export const createApiKeySchema = z.object({
  name: z.string().optional(),
  expiresIn: z.number().optional(),
  prefix: z.string().optional(),
  permissions: z.record(z.string(), z.array(z.string())).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
})

export const updateApiKeySchema = z.object({
  keyId: z.string(),
  name: z.string().optional(),
  enabled: z.boolean().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
})

export type ApiKey = z.infer<typeof apiKeySchema>
export type CreateApiKey = z.infer<typeof createApiKeySchema>
export type UpdateApiKey = z.infer<typeof updateApiKeySchema>

export const apiKeyApi = {
  async list() {
    const response = await authClient.apiKey.list({})
    if (response.error) {
      throw new Error(response.error.message || "Failed to list API keys")
    }
    return response.data
  },

  async create(data: CreateApiKey) {
    const response = await authClient.apiKey.create(data)
    if (response.error) {
      throw new Error(response.error.message || "Failed to create API key")
    }
    return response.data
  },

  async update(data: UpdateApiKey) {
    const response = await authClient.apiKey.update(data)
    if (response.error) {
      throw new Error(response.error.message || "Failed to update API key")
    }
    return response.data
  },

  async delete(keyId: string) {
    const response = await authClient.apiKey.delete({ keyId })
    if (response.error) {
      throw new Error(response.error.message || "Failed to delete API key")
    }
    return response.data
  },

  async get(id: string) {
    const response = await authClient.apiKey.get({ query: { id } })
    if (response.error) {
      throw new Error(response.error.message || "Failed to get API key")
    }
    return response.data
  },
}
