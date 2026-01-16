import { AnimatePresence, motion } from "framer-motion";
import JobStatusBadge from "./JobStatusBadge";
import JobsEmptyState from "./JobsEmptyState";
import { useAppDispatch } from "@/hooks/redux";
import { retryExistingJob } from "@/features/jobs/slice/jobsSlice";

interface Job {
  id: number;
  job_type: string;
  status: string;
  attempts: number;
  max_attempts: number;
  created_at: string;
}

interface Props {
  jobs: Job[];
  loading: boolean;
}

export default function JobsTable({ jobs, loading }: Props) {
  const dispatch = useAppDispatch();

 

  if (loading) {
    return (
      <div className="py-12 text-center text-sm text-gray-500 dark:text-zinc-400">
        Loading jobs…
      </div>
    );
  }

  if (jobs.length === 0) {
    return <JobsEmptyState />;
  }

  return (
    <div className="overflow-x-auto">
      <table
        className="
          w-full border-collapse
          bg-white dark:bg-zinc-900
          text-gray-900 dark:text-zinc-100
          border border-gray-200 dark:border-zinc-800
          rounded-xl overflow-hidden
        "
      >
        <thead>
          <tr
            className="
              bg-gray-100 dark:bg-zinc-800
              text-gray-600 dark:text-zinc-300
              text-left text-xs
            "
          >
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Attempts</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>

       
        <motion.tbody layout>
          <AnimatePresence>
            {jobs.map((job) => (
              <motion.tr
                key={job.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="
                  border-b border-neutral-200 dark:border-neutral-800
                  hover:bg-neutral-100 dark:hover:bg-neutral-800
                "
              >
                <td className="px-4 py-3">#{job.id}</td>
                <td className="px-4 py-3 capitalize">{job.job_type}</td>
                <td className="px-4 py-3">
                  <JobStatusBadge status={job.status} />
                </td>
                <td className="px-4 py-3">
                  {job.attempts}/{job.max_attempts}
                </td>
                <td className="px-4 py-3">
                  {new Date(job.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right">
                  {job.status !== "running" &&
                    job.attempts < job.max_attempts && (
                      <button
                        onClick={() => dispatch(retryExistingJob(job.id))}
                        className="
                          text-xs font-medium
                          text-indigo-600 hover:text-indigo-700
                          dark:text-indigo-400 dark:hover:text-indigo-300
                        "
                      >
                        Retry
                      </button>
                    )}
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </motion.tbody>
      </table>
    </div>
  );
}
