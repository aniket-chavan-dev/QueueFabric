import { useState } from "react";

type JobType = "email";

interface Props {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function CreateJobForm({ onSubmit, onCancel, loading }: Props) {
  const [jobType, setJobType] = useState<JobType>("email");
  const [payload, setPayload] = useState({
    to: "",
    subject: "",
    body: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPayload((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const toList = payload.to
      .split(",")
      .map((email) => email.trim())
      .filter(Boolean);

    onSubmit({
      job_type: jobType,
      payload: {
        ...payload,
        to: toList,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
     
      <div className="space-y-1">
        <label className="text-sm font-medium">Job Type</label>
        <select
          value={jobType}
          onChange={(e) => setJobType(e.target.value as JobType)}
          className="
            w-full rounded-md px-3 py-2.5 text-sm
            bg-white dark:bg-zinc-800
            border border-neutral-300 dark:border-zinc-700
            focus:outline-none focus:ring-2 focus:ring-indigo-500
          "
        >
          <option value="email">Email</option>
        </select>
      </div>

     
      {jobType === "email" && (
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">To</label>
            <input
              name="to"
              required
              value={payload.to}
              onChange={handleChange}
              placeholder="user@example.com"
              className="
                w-full rounded-md px-3 py-2.5 text-sm
                bg-white dark:bg-zinc-800
                border border-neutral-300 dark:border-zinc-700
                focus:ring-2 focus:ring-indigo-500
              "
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Subject</label>
            <input
              name="subject"
              required
              value={payload.subject}
              onChange={handleChange}
              className="
                w-full rounded-md px-3 py-2.5 text-sm
                bg-white dark:bg-zinc-800
                border border-neutral-300 dark:border-zinc-700
                focus:ring-2 focus:ring-indigo-500
              "
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Body</label>
            <textarea
              name="body"
              rows={4}
              required
              value={payload.body}
              onChange={handleChange}
              className="
                w-full rounded-md px-3 py-2.5 text-sm resize-none
                bg-white dark:bg-zinc-800
                border border-neutral-300 dark:border-zinc-700
                focus:ring-2 focus:ring-indigo-500
              "
            />
          </div>
        </div>
      )}

     
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="
            px-4 py-2 rounded-md text-sm
            bg-neutral-100 text-neutral-800
            hover:bg-neutral-200
            dark:bg-zinc-800 dark:text-zinc-100
            dark:hover:bg-zinc-700
          "
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="
            px-4 py-2 rounded-md text-sm font-medium
            bg-indigo-600 text-white
            hover:bg-indigo-700
            disabled:opacity-50
          "
        >
          {loading ? "Creating..." : "Create Job"}
        </button>
      </div>
    </form>
  );
}
