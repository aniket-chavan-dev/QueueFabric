import { type FC } from "react"
import { motion } from "framer-motion"

export interface Job {
  id: number
  type: string
  payload: string
  status: "pending" | "running" | "completed" | "failed"
  created_at: string
  updated_at: string
}

interface JobCardProps {
  job: Job
}

const statusStyles: Record<Job["status"], string> = {
  pending:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",
  running:
    "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  completed:
    "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  failed:
    "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
}

export const JobsDashboardCard: FC<JobCardProps> = ({ job }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
     className="
    rounded-2xl p-4 sm:p-5
    bg-white dark:bg-zinc-900/80
    border border-gray-200 dark:border-zinc-800
    shadow-sm
    hover:shadow-xl hover:-translate-y-1
    dark:hover:shadow-indigo-500/10
    transition-all duration-300
  "

    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
       <h2 className="font-semibold text-base sm:text-lg capitalize text-gray-900 dark:text-zinc-100">

          {job.type}
        </h2>

        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[job.status]}`}
        >
          {job.status}
        </span>
      </div>

      {/* Payload */}
      <p className="text-sm text-gray-600 dark:text-zinc-400 line-clamp-2 mb-4">
        {job.payload}
      </p>

      {/* Footer */}
      <div className="flex justify-between text-xs text-gray-400 dark:text-zinc-500">
        <span>
          Created: {new Date(job.created_at).toLocaleString()}
        </span>
        <span>
          Updated: {new Date(job.updated_at).toLocaleString()}
        </span>
      </div>
    </motion.div>
  )
}
