import { AppSidebar } from "@/components/app-sidebar"
import { PermissionGuard } from "@/components/permission-guard"
import { SiteHeader } from "@/components/site-header"
import { Can } from "@/components/can"
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
import { UsersTable } from "@/components/users-table"
import { CreateUserDialog } from "@/components/create-user-dialog"
import type { Route } from "./+types/users"

export function clientLoader() {
  return null
}

export default function UsersPage({}: Route.ComponentProps) {
  return (
    <PermissionGuard resource="user" permissions="read">
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
                    <h1 className="text-3xl font-bold">User Management</h1>
                    <p className="text-muted-foreground mt-2">
                      Manage users, roles, and permissions
                    </p>
                  </div>

                  <div className="grid gap-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <div>
                          <CardTitle>All Users</CardTitle>
                          <CardDescription>
                            View and manage all users in the system
                          </CardDescription>
                        </div>
                        <Can resource="user" permissions="create">
                          <CreateUserDialog />
                        </Can>
                      </CardHeader>
                      <CardContent>
                        <UsersTable />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Role Information</CardTitle>
                        <CardDescription>
                          Available roles in the system
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <h3 className="font-semibold text-lg mb-2">Admin</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            Full administrative access to the system
                          </p>
                          <div className="text-xs text-muted-foreground">
                            Can manage users, sessions, API keys, accounts, and invitations. Has read access to documentation and test resources.
                          </div>
                        </div>

                        <div className="border rounded-lg p-4">
                          <h3 className="font-semibold text-lg mb-2">Regular</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            Standard user with limited access (default)
                          </p>
                          <div className="text-xs text-muted-foreground">
                            Can read test resources. This is the default role assigned to new users.
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Permissions Overview</CardTitle>
                        <CardDescription>
                          What each role can do
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 text-sm">
                          <div className="grid grid-cols-3 gap-4 font-semibold border-b pb-2">
                            <div>Resource</div>
                            <div>Admin</div>
                            <div>Regular</div>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div>Users</div>
                            <div className="text-green-600">Full Access</div>
                            <div className="text-gray-400">No Access</div>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div>Sessions</div>
                            <div className="text-green-600">Full Access</div>
                            <div className="text-gray-400">No Access</div>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div>API Keys</div>
                            <div className="text-green-600">Full Access</div>
                            <div className="text-gray-400">No Access</div>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div>Accounts</div>
                            <div className="text-green-600">Full Access</div>
                            <div className="text-gray-400">No Access</div>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div>Signup</div>
                            <div className="text-green-600">Full Access</div>
                            <div className="text-gray-400">No Access</div>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div>Documentation</div>
                            <div className="text-blue-600">Read Only</div>
                            <div className="text-gray-400">No Access</div>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div>Test</div>
                            <div className="text-gray-400">No Access</div>
                            <div className="text-blue-600">Read Only</div>
                          </div>
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
