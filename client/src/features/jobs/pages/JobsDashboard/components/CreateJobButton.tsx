import { Plus } from "lucide-react"

interface Props {
  onClick: () => void
}

export default function CreateJobButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="
        flex items-center gap-2
        px-4 py-2 rounded-lg
        bg-indigo-600 text-white
        hover:bg-indigo-700
        text-sm font-medium
      "
    >
      <Plus size={16} />
      New Job
    </button>
  )
}
