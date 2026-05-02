import { SignIn } from '@clerk/nextjs'

function MissingClerkConfig() {
  return (
    <div className="max-w-md rounded-lg border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
      <h1 className="mb-2 text-lg font-semibold">Clerk is not configured</h1>
      <p>Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY in Vercel to enable sign in.</p>
    </div>
  )
}

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? <SignIn /> : <MissingClerkConfig />}
    </main>
  )
}
