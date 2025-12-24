import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { PermissionGuard } from "@/components/permission-guard"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCreateInvitation } from "@/lib/hooks/use-invitation"
import type { Route } from "./+types/invitations"
import { IconMail, IconSend } from "@tabler/icons-react"

export function clientLoader() {
  return null
}

export default function InvitationsPage({}: Route.ComponentProps) {
  const [email, setEmail] = useState("")
  const createMutation = useCreateInvitation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await createMutation.mutateAsync({ invitee: email })
    setEmail("")
  }

  return (
    <PermissionGuard resource="signup" permissions="invite">
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="px-4 lg:px-6">
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold">Invitations</h1>
                    <p className="text-muted-foreground mt-2">
                      Send invitations to new users to join your organization
                    </p>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <IconMail className="size-5" />
                          <CardTitle>Send Invitation</CardTitle>
                        </div>
                        <CardDescription>
                          Enter the email address of the person you want to invite
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="invitee">Email Address</Label>
                            <Input
                              id="invitee"
                              type="email"
                              placeholder="user@example.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                              disabled={createMutation.isPending}
                            />
                          </div>
                          <Button
                            type="submit"
                            disabled={createMutation.isPending}
                            className="w-full"
                          >
                            <IconSend className="mr-2" />
                            {createMutation.isPending
                              ? "Sending..."
                              : "Send Invitation"}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>About Invitations</CardTitle>
                        <CardDescription>
                          How the invitation system works
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">What happens next?</h4>
                          <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                            <li>The invitee will receive an invitation email</li>
                            <li>They can click the link to create an account</li>
                            <li>Once registered, they'll have access to the system</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Important Notes</h4>
                          <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                            <li>Only valid email addresses can be invited</li>
                            <li>Invitations are tracked in the system</li>
                            <li>Each email can only be invited once</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </PermissionGuard>
  )
}
