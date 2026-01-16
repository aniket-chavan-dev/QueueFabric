import clsx from "clsx"

interface Props {
  status: string
}

export default function JobStatusBadge({ status }: Props) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
        {
          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300":
            status === "pending",
          "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300":
            status === "running",
          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300":
            status === "complete",
          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300":
            status === "failed",
        }
      )}
    >
      {status}
    </span>
  )
}
