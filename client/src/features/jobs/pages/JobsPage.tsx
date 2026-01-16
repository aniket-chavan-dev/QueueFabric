export default function JobsPage() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="p-4 rounded-lg border border-zinc-700 bg-zinc-800 dark:bg-zinc-900 text-white"
        >
          <h2 className="font-semibold text-lg">Job #{i + 1}</h2>
          <p className="mt-2 text-sm text-zinc-300">
            This is a placeholder for job description.
          </p>
        </div>
      ))}
    </div>
  )
}
