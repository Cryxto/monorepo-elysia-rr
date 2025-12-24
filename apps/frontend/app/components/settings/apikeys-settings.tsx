import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
import { DateTime } from "luxon"
import { Copy } from "lucide-react"
import { useApiKeys, useCreateApiKey, useDeleteApiKey } from "@/lib/hooks/use-apikey"

export function ApiKeysSettings() {
  const [isCreating, setIsCreating] = useState(false)
  const [newKeyName, setNewKeyName] = useState("")
  const [createdKey, setCreatedKey] = useState<string | null>(null)

  const { data: apiKeys, isLoading } = useApiKeys()
  const createMutation = useCreateApiKey()
  const revokeMutation = useDeleteApiKey()

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newKeyName.trim()) {
      toast.error("Please enter a name for the API key")
      return
    }
    try {
      const result = await createMutation.mutateAsync({ name: newKeyName })
      if (result?.key) {
        setCreatedKey(result.key)
        setNewKeyName("")
      }
    } catch (error) {
      // Error is already handled by the mutation hook
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard")
  }

  if (isLoading) {
    return <div>Loading API keys...</div>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>
              Manage your API keys for programmatic access
            </CardDescription>
          </div>
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button>Create API Key</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New API Key</DialogTitle>
                <DialogDescription>
                  Give your API key a descriptive name to help you remember what it's for.
                </DialogDescription>
              </DialogHeader>

              {createdKey ? (
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm font-medium text-yellow-800 mb-2">
                      Important: Save this key now!
                    </p>
                    <p className="text-xs text-yellow-700">
                      You won't be able to see it again after closing this dialog.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Your API Key</Label>
                    <div className="flex gap-2">
                      <Input
                        value={createdKey}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => copyToClipboard(createdKey)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      onClick={() => {
                        setCreatedKey(null)
                        setIsCreating(false)
                      }}
                    >
                      Done
                    </Button>
                  </DialogFooter>
                </div>
              ) : (
                <form onSubmit={handleCreateKey} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="key-name">Key Name</Label>
                    <Input
                      id="key-name"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="e.g., Production API"
                      required
                    />
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreating(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createMutation.isPending}>
                      {createMutation.isPending ? "Creating..." : "Create"}
                    </Button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!apiKeys || apiKeys.length === 0 ? (
          <p className="text-muted-foreground text-sm">No API keys created yet</p>
        ) : (
          apiKeys.map((apiKey) => {
            const maskedKey = apiKey.start ? `${apiKey.start}...****` : "****...****"

            return (
              <div
                key={apiKey.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{apiKey.name}</p>
                    {apiKey.enabled ? (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                        Active
                      </span>
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                        Disabled
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                      {maskedKey}
                    </code>
                  </div>

                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>
                      Created {DateTime.fromJSDate(new Date(apiKey.createdAt)).toRelative()}
                    </span>
                    {apiKey.expiresAt && (
                      <span>
                        Expires {DateTime.fromJSDate(new Date(apiKey.expiresAt)).toRelative()}
                      </span>
                    )}
                  </div>

                  {apiKey.rateLimitEnabled && (
                    <p className="text-xs text-muted-foreground">
                      Rate limit: {apiKey.remaining || apiKey.rateLimitMax}/{apiKey.rateLimitMax} requests
                    </p>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => revokeMutation.mutate(apiKey.id)}
                  disabled={revokeMutation.isPending}
                >
                  Revoke
                </Button>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
