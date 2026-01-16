import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { setFilters } from "@/features/jobs/slice/jobsSlice"

export default function JobsPagination() {
  const dispatch = useAppDispatch()
  const { next, previous, filters, count } = useAppSelector(
    (state) => state.jobs
  )

  

  const currentPage = filters.page
  const totalPages = Math.max(1, Math.ceil(count / 10))

  return (
    <div className="flex items-center justify-between pt-4">
      <p className="text-xs text-gray-600 dark:text-zinc-400">
        Page <span className="font-medium">{currentPage}</span> of{" "}
        <span className="font-medium">{totalPages}</span>
      </p>

      <div className="flex gap-2">
        {/* Prev */}
        <button
          disabled={!previous}
          onClick={() =>
            dispatch(setFilters({ page: currentPage - 1 }))
          }
          className="
            px-4 py-1.5 text-sm font-medium rounded-lg
            border
            text-gray-700 bg-white border-gray-300
            hover:bg-gray-50
            disabled:opacity-40 disabled:cursor-not-allowed

            dark:text-zinc-200
            dark:bg-zinc-800
            dark:border-zinc-700
            dark:hover:bg-zinc-700
          "
        >
          Prev
        </button>

        {/* Next */}
        <button
          disabled={!next}
          onClick={() =>
            dispatch(setFilters({ page: currentPage + 1 }))
          }
          className="
            px-4 py-1.5 text-sm font-medium rounded-lg
            border
            text-gray-700 bg-white border-gray-300
            hover:bg-gray-50
            disabled:opacity-40 disabled:cursor-not-allowed

            dark:text-zinc-200
            dark:bg-zinc-800
            dark:border-zinc-700
            dark:hover:bg-zinc-700
          "
        >
          Next
        </button>
      </div>
    </div>
  )
}
