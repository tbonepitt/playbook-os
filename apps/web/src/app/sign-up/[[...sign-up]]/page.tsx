import { SignUp } from '@clerk/nextjs'
import { AuthUnavailable } from '@/components/auth/AuthUnavailable'

export default function SignUpPage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return <AuthUnavailable />

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        fallbackRedirectUrl="/library"
        forceRedirectUrl="/library"
      />
    </main>
  )
}
