import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import type { Session } from "@packages/contracts"
import { DateTime } from "luxon"
import { authClient } from "@/lib/auth"

async function fetchSessions(): Promise<Session[]> {
  const response = await authClient.listSessions()
  if (response.error) {
    throw new Error(response.error.message || "Failed to fetch sessions")
  }
  return response.data || []
}

async function revokeSession(sessionId: string): Promise<void> {
  const response = await authClient.revokeSession({ token: sessionId })
  if (response.error) {
    throw new Error(response.error.message || "Failed to revoke session")
  }
}

async function revokeAllSessions(): Promise<void> {
  const response = await authClient.revokeOtherSessions()
  if (response.error) {
    throw new Error(response.error.message || "Failed to revoke sessions")
  }
}

export function SessionsSettings() {
  const queryClient = useQueryClient()

  const { data: sessions, isLoading } = useQuery({
    queryKey: ["sessions"],
    queryFn: fetchSessions,
  })

  const revokeMutation = useMutation({
    mutationFn: revokeSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] })
      toast.success("Session revoked successfully")
    },
    onError: () => {
      toast.error("Failed to revoke session")
    },
  })

  const revokeAllMutation = useMutation({
    mutationFn: revokeAllSessions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] })
      toast.success("All other sessions revoked successfully")
    },
    onError: () => {
      toast.error("Failed to revoke sessions")
    },
  })

  if (isLoading) {
    return <div>Loading sessions...</div>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Active Sessions</CardTitle>
            <CardDescription>
              Manage your active sessions across different devices
            </CardDescription>
          </div>
          {sessions && sessions.length > 1 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => revokeAllMutation.mutate()}
              disabled={revokeAllMutation.isPending}
            >
              Revoke All Others
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!sessions || sessions.length === 0 ? (
          <p className="text-muted-foreground text-sm">No active sessions</p>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">
                    {session.userAgent || "Unknown Device"}
                  </p>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  IP: {session.ipAddress || "Unknown"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Created {DateTime.fromJSDate(new Date(session.createdAt)).toRelative()}
                </p>
                <p className="text-xs text-muted-foreground">
                  Expires {DateTime.fromJSDate(new Date(session.expiresAt)).toRelative()}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => revokeMutation.mutate(session.id)}
                disabled={revokeMutation.isPending}
              >
                Revoke
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
