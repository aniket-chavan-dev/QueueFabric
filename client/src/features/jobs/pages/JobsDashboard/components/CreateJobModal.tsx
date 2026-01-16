import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import CreateJobForm from "./CreateJobForm";

import { useAppDispatch } from "@/hooks/redux";
import { createNewJob } from "@/features/jobs/slice/jobsSlice";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CreateJobModal({ open, onClose }: Props) {
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();


  const handleCreateJob = async (data: any) => {
  try {
    setLoading(true);
    await dispatch(createNewJob(data)).unwrap();
    onClose();
  } catch (err) {
    console.error("Job creation failed", err);
  } finally {
    setLoading(false);
  }
};

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="
              w-full max-w-xl
              rounded-xl
              bg-white dark:bg-zinc-900
              text-neutral-900 dark:text-zinc-100
              border border-neutral-200 dark:border-zinc-700
              shadow-2xl
            "
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
          >
          
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-zinc-700">
              <h3 className="text-lg font-semibold">Create Job</h3>
              <button
                onClick={onClose}
                className="
                  p-2 rounded-md
                  text-neutral-500 hover:text-neutral-900
                  dark:text-zinc-400 dark:hover:text-zinc-100
                  hover:bg-neutral-100 dark:hover:bg-zinc-800
                "
              >
                <X size={18} />
              </button>
            </div>

           
            <div className="px-6 py-6">
              <CreateJobForm
                onSubmit={handleCreateJob}
                loading={loading}
                onCancel={onClose}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
