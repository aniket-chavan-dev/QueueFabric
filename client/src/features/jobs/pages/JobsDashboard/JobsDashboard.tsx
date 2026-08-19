import { useEffect } from "react";
import { motion } from "framer-motion";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchJobs } from "@/features/jobs/slice/jobsSlice";

import { useState } from "react";
import CreateJobButton from "./components/CreateJobButton";
import CreateJobModal from "./components/CreateJobModal";

import JobsTable from "./components/JobsTable";
import JobsFilters from "./components/JobsFilters";
import JobsPagination from "./components/JobsPagination";

export default function JobsDashboard() {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();

  const { list, loading, filters } = useAppSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchJobs(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    const hasActiveJobs = list.some(
      (job) => job.status === "pending" || job.status === "running",
    );

    if (!hasActiveJobs) return;

    const intervalId = setInterval(() => {
      dispatch(fetchJobs(filters));
    }, 3000);

    return () => clearInterval(intervalId);
  }, [list, dispatch, filters]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-600 dark:text-zinc-300">
          Jobs
        </h2>
        <CreateJobButton onClick={() => setOpen(true)} />
      </div>

      <CreateJobModal open={open} onClose={() => setOpen(false)} />

      <JobsFilters />

      <JobsTable jobs={list} loading={loading.list} />

      <JobsPagination />
    </motion.div>
  );
}
