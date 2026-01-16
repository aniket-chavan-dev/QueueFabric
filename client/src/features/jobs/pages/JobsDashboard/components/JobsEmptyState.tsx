import { motion } from "framer-motion"

export default function JobsEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="
        text-center py-16
        text-gray-500 dark:text-zinc-400
      "
    >
      <p className="text-sm">No jobs found</p>
      <p className="text-xs mt-1">
        Try adjusting filters or create a new job
      </p>
    </motion.div>
  )
}
