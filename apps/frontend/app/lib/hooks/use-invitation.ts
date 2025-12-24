import { useMutation } from "@tanstack/react-query"
import { invitationApi } from "../api/invitation"
import type { CreateInvitation } from "../api/invitation"
import { toast } from "sonner"

export function useCreateInvitation() {
  return useMutation({
    mutationFn: (data: CreateInvitation) => invitationApi.create(data),
    onSuccess: () => {
      toast.success("Invitation sent successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to send invitation")
    },
  })
}
