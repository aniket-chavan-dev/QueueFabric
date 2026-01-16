import { motion } from "framer-motion"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { setFilters } from "@/features/jobs/slice/jobsSlice"

const STATUS_OPTIONS = [
  { label: "All Status", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Running", value: "running" },
  { label: "Complete", value: "complete" },
  { label: "Failed", value: "failed" },
]

const TYPE_OPTIONS = [
  { label: "All Types", value: "" },
  { label: "Email", value: "email" },
  // { label: "Webhook", value: "webhook" }, till now this is not implemented in backend
]

export default function JobsFilters() {
  const dispatch = useAppDispatch()
  const { filters } = useAppSelector((state) => state.jobs)

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="
        flex flex-wrap gap-4
        bg-white dark:bg-zinc-900
        border border-gray-200 dark:border-zinc-800
        rounded-xl p-4
      "
    >
      
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500 dark:text-zinc-400">
          Status
        </label>
        <select
          value={filters.status}
          onChange={(e) =>
            dispatch(setFilters({ status: e.target.value }))
          }
          className="
            rounded-lg px-3 py-2 text-sm
            bg-gray-50 dark:bg-zinc-800
            border border-gray-200 dark:border-zinc-700
            text-gray-900 dark:text-zinc-100
            focus:outline-none focus:ring-2 focus:ring-indigo-500
          "
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

     
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500 dark:text-zinc-400">
          Job Type
        </label>
        <select
          value={filters.job_type}
          onChange={(e) =>
            dispatch(setFilters({ job_type: e.target.value }))
          }
          className="
            rounded-lg px-3 py-2 text-sm
            bg-gray-50 dark:bg-zinc-800
            border border-gray-200 dark:border-zinc-700
            text-gray-900 dark:text-zinc-100
            focus:outline-none focus:ring-2 focus:ring-indigo-500
          "
        >
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </motion.div>
  )
}
