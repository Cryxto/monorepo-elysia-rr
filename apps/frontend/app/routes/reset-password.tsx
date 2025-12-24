import { ResetPasswordForm } from "@/components/reset-password-form"
import type { Route } from "./+types/reset-password"

export function clientLoader() {
  return null
}

export default function ResetPasswordPage({}: Route.ComponentProps) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ResetPasswordForm />
      </div>
    </div>
  )
}
