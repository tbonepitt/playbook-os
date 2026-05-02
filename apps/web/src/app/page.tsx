import Link from 'next/link'

function LearningExampleVisual() {
  return (
    <div className="relative mt-14 w-full max-w-5xl overflow-hidden rounded-3xl border border-gray-200 bg-gray-950 p-4 shadow-2xl shadow-gray-200/70 md:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.28),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.22),transparent_30%)]" />
      <div className="relative grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">Saved from X</span>
            <span className="text-xs text-white/45">Dense thread · 18 posts</span>
          </div>
          <div className="rounded-xl bg-white p-4 text-left shadow-lg">
            <div className="mb-3 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gray-900" />
              <div>
                <div className="h-2.5 w-24 rounded-full bg-gray-900" />
                <div className="mt-1.5 h-2 w-16 rounded-full bg-gray-200" />
              </div>
            </div>
            <p className="text-sm font-semibold leading-6 text-gray-950">
              The best product teams do not just ship faster. They build reusable learning loops...
            </p>
            <div className="mt-4 space-y-2">
              <div className="h-2 rounded-full bg-gray-200" />
              <div className="h-2 w-11/12 rounded-full bg-gray-200" />
              <div className="h-2 w-4/5 rounded-full bg-gray-200" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-white/80">
            <span>Bookmark pile</span>
            <span className="text-white/35">→</span>
            <span>Learning asset</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 text-left shadow-xl md:p-5">
          <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Generated in 42 seconds</p>
              <h2 className="mt-1 text-lg font-bold text-gray-950">Reusable Learning Loop</h2>
            </div>
            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">Ready to share</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-200 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Bite-sized lesson</p>
              <p className="mt-2 text-sm font-medium text-gray-900">Why saved knowledge decays unless it becomes a workflow.</p>
            </div>
            <div className="rounded-xl border border-gray-200 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Framework</p>
              <p className="mt-2 text-sm font-medium text-gray-900">Capture → Compress → Practice → Share.</p>
            </div>
            <div className="rounded-xl border border-gray-200 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Flash takeaways</p>
              <ul className="mt-2 space-y-1 text-sm text-gray-700">
                <li>• Turn passive saves into active recall</li>
                <li>• Extract patterns, not just summaries</li>
              </ul>
            </div>
            <div className="rounded-xl border border-gray-200 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Shareable post</p>
              <p className="mt-2 text-sm font-medium text-gray-900">“3 ways to turn a bookmark into a durable skill…”</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

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

      <section className="mx-auto flex max-w-6xl flex-col items-start px-6 py-20">
        <p className="mb-4 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-600">
          Learn from everything you save
        </p>
        <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-gray-950 md:text-6xl">
          Don’t bookmark it and forget it.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
          Save any post, thread, PDF, repo, doc, or transcript. PlaybookOS turns dense material into bite-sized lessons, frameworks, and shareable takeaways you can actually use.
        </p>
        <div className="mt-10 flex items-center gap-4">
          <Link
            href="/sign-up"
            className="rounded-md bg-gray-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-800"
          >
            Start learning from your saves
          </Link>
          <Link href="/sign-in" className="text-sm font-semibold text-gray-900 hover:text-gray-700">
            Sign in →
          </Link>
        </div>
        <LearningExampleVisual />
      </section>
    </main>
  )
}
