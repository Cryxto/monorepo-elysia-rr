import { useState } from "react"
import { useAuth } from "@/lib/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { authClient } from "@/lib/auth"
import { Checkbox } from "@/components/ui/checkbox"

export function SecuritySettings() {
  const { user } = useAuth()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [revokeOtherSessions, setRevokeOtherSessions] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const [newEmail, setNewEmail] = useState("")
  const [isChangingEmail, setIsChangingEmail] = useState(false)

  const [isSendingVerification, setIsSendingVerification] = useState(false)

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    setIsChangingPassword(true)

    try {
      await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: revokeOtherSessions || undefined,
      })

      toast.success("Password changed successfully")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setRevokeOtherSessions(false)
    } catch (error) {
      toast.error("Failed to change password")
      console.error(error)
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsChangingEmail(true)

    try {
      await authClient.changeEmail({
        newEmail,
        callbackURL: window.location.origin + "/settings",
      })

      toast.success("Email change initiated. Please check your inbox for verification.")
      setNewEmail("")
    } catch (error) {
      toast.error("Failed to change email")
      console.error(error)
    } finally {
      setIsChangingEmail(false)
    }
  }

  const handleSendVerificationEmail = async () => {
    setIsSendingVerification(true)

    try {
      await authClient.sendVerificationEmail({
        email: user?.email || "",
        callbackURL: window.location.origin + "/settings",
      })

      toast.success("Verification email sent")
    } catch (error) {
      toast.error("Failed to send verification email")
      console.error(error)
    } finally {
      setIsSendingVerification(false)
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password and optionally revoke all other sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="revoke-sessions"
                checked={revokeOtherSessions}
                onCheckedChange={(checked) => setRevokeOtherSessions(!!checked)}
              />
              <Label
                htmlFor="revoke-sessions"
                className="text-sm font-normal cursor-pointer"
              >
                Revoke all other sessions
              </Label>
            </div>

            <Button type="submit" disabled={isChangingPassword}>
              {isChangingPassword ? "Changing..." : "Change Password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Email</CardTitle>
          <CardDescription>
            Update your email address. A verification email will be sent to the new address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangeEmail} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-email">Current Email</Label>
              <Input
                id="current-email"
                value={user.email}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-email">New Email</Label>
              <Input
                id="new-email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />
            </div>

            <Button type="submit" disabled={isChangingEmail}>
              {isChangingEmail ? "Changing..." : "Change Email"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {!user.emailVerified && (
        <Card>
          <CardHeader>
            <CardTitle>Email Verification</CardTitle>
            <CardDescription>
              Your email is not verified. Verify your email to enable all features.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleSendVerificationEmail}
              disabled={isSendingVerification}
            >
              {isSendingVerification ? "Sending..." : "Send Verification Email"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
