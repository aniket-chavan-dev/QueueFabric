import { useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"

import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import {
  fetchJobById,
  fetchJobResults,
  clearSelectedJob,
} from "@/features/jobs/slice/jobsSlice"

import JobStatusBadge from "./JobsDashboard/components/JobStatusBadge"

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()

  const { selectedJob, results, loading } = useAppSelector(
    (state) => state.jobs
  )

  useEffect(() => {
    if (!id) return

    dispatch(fetchJobById(Number(id)))
    dispatch(fetchJobResults(Number(id)))

    return () => {
      dispatch(clearSelectedJob())
    }
  }, [dispatch, id])

 
  useEffect(() => {
    if (!selectedJob) return
    if (selectedJob.status !== "running") return

    const interval = setInterval(() => {
      dispatch(fetchJobById(selectedJob.id))
      dispatch(fetchJobResults(selectedJob.id))
    }, 4000)

    return () => clearInterval(interval)
  }, [dispatch, selectedJob])

  if (loading.detail || !selectedJob) {
    return (
      <div className="p-6 text-sm text-gray-500 dark:text-zinc-400">
        Loading job details…
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      
      <Link
        to="/dashboard"
        className="text-sm text-indigo-600 hover:underline"
      >
        ← Back to Jobs
      </Link>

    
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-zinc-100">
            Job #{selectedJob.id}
          </h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Type: {selectedJob.job_type}
          </p>
        </div>

        <JobStatusBadge status={selectedJob.status} />
      </div>

     
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div className="rounded-lg border p-4 dark:border-zinc-800">
          <p className="text-gray-500">Attempts</p>
          <p className="font-medium">
            {selectedJob.attempts} / {selectedJob.max_attempts}
          </p>
        </div>

        <div className="rounded-lg border p-4 dark:border-zinc-800">
          <p className="text-gray-500">Created At</p>
          <p className="font-medium">
            {new Date(selectedJob.created_at).toLocaleString()}
          </p>
        </div>
      </div>

      
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Execution Results</h3>

        {results.length === 0 && (
          <p className="text-sm text-gray-500">
            No execution results yet
          </p>
        )}

        {results.map((r) => (
          <div
            key={r.id}
            className="
              rounded-lg p-4
              bg-white dark:bg-zinc-900
              border border-gray-200 dark:border-zinc-800
              text-sm
            "
          >
            <p className="text-xs text-gray-400 mb-2">
              Completed at{" "}
              {new Date(r.completed_at).toLocaleString()}
            </p>

            {r.error ? (
              <pre className="text-red-500 whitespace-pre-wrap">
                {r.error}
              </pre>
            ) : (
              <pre className="text-green-500 whitespace-pre-wrap">
                {r.output}
              </pre>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  )
}
