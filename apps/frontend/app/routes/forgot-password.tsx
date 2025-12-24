import { ForgotPasswordForm } from "@/components/forgot-password-form"
import type { Route } from "./+types/forgot-password"

export function clientLoader() {
  return null
}

export default function ForgotPasswordPage({}: Route.ComponentProps) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
