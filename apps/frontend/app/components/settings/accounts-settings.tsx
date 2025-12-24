import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import type { Account } from "@packages/contracts"
import { DateTime } from "luxon"
import { authClient } from "@/lib/auth"

async function fetchAccounts(): Promise<Account[]> {
  const response = await authClient.listAccounts()
  if (response.error) {
    throw new Error(response.error.message || "Failed to fetch accounts")
  }
  return response.data || []
}

async function unlinkAccount({ providerId, accountId }: { providerId: string; accountId: string }): Promise<void> {
  const response = await authClient.unlinkAccount({ providerId, accountId })
  if (response.error) {
    throw new Error(response.error.message || "Failed to unlink account")
  }
}

const providerNames: Record<string, string> = {
  google: "Google",
  github: "GitHub",
  facebook: "Facebook",
  twitter: "Twitter",
  discord: "Discord",
  microsoft: "Microsoft",
}

export function AccountsSettings() {
  const queryClient = useQueryClient()

  const { data: accounts, isLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: fetchAccounts,
  })

  const unlinkMutation = useMutation({
    mutationFn: unlinkAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] })
      toast.success("Account unlinked successfully")
    },
    onError: () => {
      toast.error("Failed to unlink account")
    },
  })

  if (isLoading) {
    return <div>Loading accounts...</div>
  }

  const passwordAccount = accounts?.find(acc => acc.providerId === "credential")
  const socialAccounts = accounts?.filter(acc => acc.providerId !== "credential") || []

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Password Account</CardTitle>
          <CardDescription>
            Your email and password login credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
          {passwordAccount ? (
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <p className="font-medium">Email & Password</p>
                <p className="text-sm text-muted-foreground">
                  Connected {DateTime.fromJSDate(new Date(passwordAccount.createdAt)).toRelative()}
                </p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded">
                Active
              </span>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              No password account configured. You can set one up in the Security tab.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
          <CardDescription>
            Manage your social account connections for easy sign-in
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {socialAccounts.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No social accounts connected yet
            </p>
          ) : (
            socialAccounts.map((account) => {
              const providerName = providerNames[account.providerId] || account.providerId

              return (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{providerName}</p>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                        Connected
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Account ID: {account.accountId}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Connected {DateTime.fromJSDate(new Date(account.createdAt)).toRelative()}
                    </p>
                    {account.scope && (
                      <p className="text-xs text-muted-foreground">
                        Scopes: {account.scope}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => unlinkMutation.mutate({ providerId: account.providerId, accountId: account.accountId })}
                    disabled={unlinkMutation.isPending}
                  >
                    Unlink
                  </Button>
                </div>
              )
            })
          )}

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-3">
              Connect additional accounts to sign in with multiple providers
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(providerNames).map(([providerId, providerName]) => {
                const isConnected = socialAccounts.some(acc => acc.providerId === providerId)

                if (isConnected) return null

                return (
                  <Button
                    key={providerId}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      toast.info(`Connect ${providerName} (feature not yet implemented)`)
                    }}
                  >
                    Connect {providerName}
                  </Button>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
