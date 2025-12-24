import { AppSidebar } from "@/components/app-sidebar"
import { ProtectedRoute } from "@/components/protected-route"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileSettings } from "@/components/settings/profile-settings"
import { SessionsSettings } from "@/components/settings/sessions-settings"
import { ApiKeysSettings } from "@/components/settings/apikeys-settings"
import { AccountsSettings } from "@/components/settings/accounts-settings"
import { SecuritySettings } from "@/components/settings/security-settings"

import type { Route } from "./+types/settings"

export function clientLoader() {
  return null
}

export default function SettingsPage({}: Route.ComponentProps) {
  return (
    <ProtectedRoute>
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
                    <h1 className="text-3xl font-bold">Settings</h1>
                    <p className="text-muted-foreground mt-2">
                      Manage your account settings and preferences
                    </p>
                  </div>

                  <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="profile">Profile</TabsTrigger>
                      <TabsTrigger value="security">Security</TabsTrigger>
                      <TabsTrigger value="sessions">Sessions</TabsTrigger>
                      <TabsTrigger value="apikeys">API Keys</TabsTrigger>
                      <TabsTrigger value="accounts">Accounts</TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile" className="space-y-4">
                      <ProfileSettings />
                    </TabsContent>

                    <TabsContent value="security" className="space-y-4">
                      <SecuritySettings />
                    </TabsContent>

                    <TabsContent value="sessions" className="space-y-4">
                      <SessionsSettings />
                    </TabsContent>

                    <TabsContent value="apikeys" className="space-y-4">
                      <ApiKeysSettings />
                    </TabsContent>

                    <TabsContent value="accounts" className="space-y-4">
                      <AccountsSettings />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  )
}
