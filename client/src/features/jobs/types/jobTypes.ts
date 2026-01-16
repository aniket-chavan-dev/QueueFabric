
export type JobStatus = "pending" | "running" | "success" | "failed" | "complete";


export interface Job {
  id: number
  job_type: string
  payload: Record<string, any> | null
  status: JobStatus
  attempts: number
  max_attempts: number
  created_at: string
  updated_at: string
}


export interface JobResult {
  id: number
  job: number
  output: string | null
  error: string | null
  execution_time_ms: number | null
  completed_at: string
}


export interface PaginatedJobsResponse {
  count: number
  next: string | null
  previous: string | null
  results: Job[]
}

export interface CreateJobPayload {
  job_type: string
  payload?: Record<string, any>
}
