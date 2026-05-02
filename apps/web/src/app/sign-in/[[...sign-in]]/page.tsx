import { SignIn } from '@clerk/nextjs'
import { AuthUnavailable } from '@/components/auth/AuthUnavailable'

export default function SignInPage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return <AuthUnavailable />

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/library"
        forceRedirectUrl="/library"
      />
    </main>
  )
}
