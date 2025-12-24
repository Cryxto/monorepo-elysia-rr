import { useState } from "react"
import { useUsers, useSetUserRole, useBanUser, useUnbanUser, useRemoveUser } from "@/lib/hooks/use-users"
import { Can } from "@/components/can"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { User } from "@packages/contracts"
import { DateTime } from "luxon"
import { IconDotsVertical, IconShield, IconShieldOff, IconTrash, IconUserCheck } from "@tabler/icons-react"

interface SetRoleDialogProps {
  user: User
  onOpenChange?: (open: boolean) => void
}

function SetRoleDialog({ user, onOpenChange }: SetRoleDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<"admin" | "regular">(user.role || "regular")
  const setRoleMutation = useSetUserRole()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await setRoleMutation.mutateAsync({
      userId: user.id,
      role: selectedRole,
    })
    setOpen(false)
    onOpenChange?.(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <IconShield className="mr-2 h-4 w-4" />
          Change Role
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change User Role</DialogTitle>
          <DialogDescription>
            Update {user.name}'s role and permissions
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as "admin" | "regular")}>
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin - Full Access</SelectItem>
                <SelectItem value="regular">Regular - Limited Access</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={setRoleMutation.isPending}>
              {setRoleMutation.isPending ? "Updating..." : "Update Role"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface BanUserDialogProps {
  user: User
  onOpenChange?: (open: boolean) => void
}

function BanUserDialog({ user, onOpenChange }: BanUserDialogProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState("")
  const [expiresIn, setExpiresIn] = useState("")
  const banMutation = useBanUser()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await banMutation.mutateAsync({
      userId: user.id,
      banReason: reason || undefined,
      banExpiresIn: expiresIn ? parseInt(expiresIn) : undefined,
    })
    setOpen(false)
    onOpenChange?.(false)
    setReason("")
    setExpiresIn("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <IconShieldOff className="mr-2 h-4 w-4" />
          Ban User
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ban User</DialogTitle>
          <DialogDescription>
            Restrict {user.name}'s access to the system
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for banning this user..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiresIn">Ban Duration (Optional)</Label>
            <Input
              id="expiresIn"
              type="number"
              value={expiresIn}
              onChange={(e) => setExpiresIn(e.target.value)}
              placeholder="Days until ban expires"
            />
            <p className="text-sm text-muted-foreground">
              Leave empty for permanent ban
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={banMutation.isPending}>
              {banMutation.isPending ? "Banning..." : "Ban User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface RemoveUserDialogProps {
  user: User
  onOpenChange?: (open: boolean) => void
}

function RemoveUserDialog({ user, onOpenChange }: RemoveUserDialogProps) {
  const [open, setOpen] = useState(false)
  const removeMutation = useRemoveUser()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await removeMutation.mutateAsync({ userId: user.id })
    setOpen(false)
    onOpenChange?.(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <IconTrash className="mr-2 h-4 w-4" />
          Remove User
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove User</DialogTitle>
          <DialogDescription>
            Are you sure you want to permanently remove {user.name}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={removeMutation.isPending}>
              {removeMutation.isPending ? "Removing..." : "Remove User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function UsersTable() {
  const [searchValue, setSearchValue] = useState("")
  const [searchField, setSearchField] = useState<'name' | 'email'>('name')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [bannedFilter, setBannedFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { data, isLoading, error } = useUsers({
    limit: pageSize,
    offset: (page - 1) * pageSize,
    searchValue: searchValue || undefined,
    searchField: searchValue ? searchField : undefined,
    role: roleFilter !== 'all' ? roleFilter : undefined,
    banned: bannedFilter !== 'all' ? bannedFilter === 'true' : undefined,
  })
  const unbanMutation = useUnbanUser()

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading users...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center text-destructive">
          <p className="font-semibold">Failed to load users</p>
          <p className="text-sm">{error instanceof Error ? error.message : "Unknown error"}</p>
        </div>
      </div>
    )
  }

  const hasFilters = searchValue || roleFilter !== 'all' || bannedFilter !== 'all'
  const clearFilters = () => {
    setSearchValue('')
    setRoleFilter('all')
    setBannedFilter('all')
    setPage(1)
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-1 gap-2">
          <Select value={searchField} onValueChange={(value: 'name' | 'email') => setSearchField(value)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="email">Email</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder={`Search by ${searchField}...`}
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value)
              setPage(1)
            }}
            className="flex-1"
          />
        </div>

        <Select value={roleFilter} onValueChange={(value) => {
          setRoleFilter(value)
          setPage(1)
        }}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="regular">Regular</SelectItem>
          </SelectContent>
        </Select>

        <Select value={bannedFilter} onValueChange={(value) => {
          setBannedFilter(value)
          setPage(1)
        }}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="false">Active</SelectItem>
            <SelectItem value="true">Banned</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        )}
      </div>

      {/* User Cards */}
      {!data || data.users.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No users found</p>
        </div>
      ) : (
        <>
      {data.users.map((user) => {
        const initials = user.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()

        return (
          <div
            key={user.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-4 flex-1">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.image || undefined} alt={user.name} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{user.name}</h3>
                  {user.banned && (
                    <Badge variant="destructive">Banned</Badge>
                  )}
                  {user.emailVerified && (
                    <IconUserCheck className="h-4 w-4 text-green-600" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                  <span className="capitalize">Role: {user.role || "regular"}</span>
                  <span>Joined {DateTime.fromJSDate(new Date(user.createdAt)).toRelative()}</span>
                </div>
                {user.banned && user.banReason && (
                  <p className="text-sm text-destructive mt-1">
                    Ban reason: {user.banReason}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {user.banned ? (
                <Can resource="user" permissions="update">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => unbanMutation.mutate({ userId: user.id })}
                    disabled={unbanMutation.isPending}
                  >
                    Unban
                  </Button>
                </Can>
              ) : null}

              <Can resource="user" permissions={["update", "delete"]} requireAll={false}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <IconDotsVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Can resource="user" permissions="update">
                      <SetRoleDialog user={user} />
                      {!user.banned && (
                        <BanUserDialog user={user} />
                      )}
                    </Can>
                    <Can resource="user" permissions="delete">
                      <DropdownMenuSeparator />
                      <RemoveUserDialog user={user} />
                    </Can>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Can>
            </div>
          </div>
        )
      })}

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
        <div className="text-sm text-muted-foreground">
          Showing {data.users.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, data.total)} of {data.total} users
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="pageSize" className="text-sm">Rows per page:</Label>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => {
                setPageSize(Number(value))
                setPage(1)
              }}
            >
              <SelectTrigger id="pageSize" className="w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {page} of {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  )
}
