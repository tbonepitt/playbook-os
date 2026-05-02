import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="text-lg font-black tracking-tight text-gray-900">
          PLAYBOOK<span className="font-semibold">OS</span>
        </span>
        <div className="flex items-center gap-3">
          <Link href="/sign-in" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800"
          >
            Get started
          </Link>
        </div>
      </header>

      <section className="mx-auto flex max-w-6xl flex-col items-start px-6 py-24">
        <p className="mb-4 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-600">
          Microlearning from your source material
        </p>
        <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-gray-950 md:text-6xl">
          Turn PDFs, docs, repos, and transcripts into bite-sized playbooks.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
          PlaybookOS helps you transform source materials into branded courses, frameworks, toolkits, and actionable learning paths.
        </p>
        <div className="mt-10 flex items-center gap-4">
          <Link
            href="/sign-up"
            className="rounded-md bg-gray-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-800"
          >
            Create an account
          </Link>
          <Link href="/sign-in" className="text-sm font-semibold text-gray-900 hover:text-gray-700">
            Sign in →
          </Link>
        </div>
      </section>
    </main>
  )
}
