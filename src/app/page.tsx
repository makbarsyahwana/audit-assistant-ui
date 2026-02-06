export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold text-gray-900">AI Audit Assistant</h1>
      <p className="mt-4 text-lg text-gray-600">
        RAG-powered assistant for audit and compliance workflows
      </p>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <a
          href="/chat"
          className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold">Chat</h2>
          <p className="mt-2 text-gray-500">Ask questions with citations</p>
        </a>
        <a
          href="/engagements"
          className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold">Engagements</h2>
          <p className="mt-2 text-gray-500">Manage audit engagements</p>
        </a>
        <a
          href="/admin/audit-trail"
          className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold">Audit Trail</h2>
          <p className="mt-2 text-gray-500">Review system activity</p>
        </a>
      </div>
    </main>
  );
}
