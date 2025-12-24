import axios from "axios"
import { z } from "zod"
import { config } from "../config"

export const invitationSchema = z.object({
  id: z.number(),
  invitee: z.string().email(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const createInvitationSchema = z.object({
  invitee: z.email("Must be a valid email address"),
})

export type Invitation = z.infer<typeof invitationSchema>
export type CreateInvitation = z.infer<typeof createInvitationSchema>

const API_BASE_URL = config.apiEndpoint

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
})

export const invitationApi = {
  async create(data: CreateInvitation) {
    const response = await axiosInstance.post<Invitation>("/invitation", data)
    return response.data
  },
}
