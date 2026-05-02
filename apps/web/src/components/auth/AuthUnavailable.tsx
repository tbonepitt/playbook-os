import Link from 'next/link'

export function AuthUnavailable() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-gray-950">Sign-in is temporarily unavailable</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          We’re finishing setup. Please try again shortly.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
        >
          Back to homepage
        </Link>
      </div>
    </main>
  )
}
