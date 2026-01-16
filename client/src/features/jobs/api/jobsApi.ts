import apiClient from "@/app/apiClient"

import type {
  Job,
  JobResult,
  PaginatedJobsResponse,
  CreateJobPayload,
} from "../types/jobTypes"



export interface ListJobsParams {
  page?: number
  status?: string
  job_type?: string
  ordering?: string
}


//api get method to fetch list of jobs with optional query parameters e.p 'status','job_type'
export async function listJobs(
  params: ListJobsParams = {}
): Promise<PaginatedJobsResponse> {

  const cleanedParams = Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== "" && value !== undefined
    )
  )
  const response = await apiClient.get("/jobs/", {
    params: cleanedParams,
  })

  return response.data
}

//api post method for create a new job till noew only email type job is supported
export async function createJob(
  payload: CreateJobPayload
): Promise<Job> {
  const response = await apiClient.post("/jobs/", payload)
  return response.data
}

//api get method to fetch a job by its id
export async function getJob(
  jobId: number
): Promise<Job> {
  const response = await apiClient.get(`/jobs/${jobId}/`)
  return response.data
}

//retry job api till now only 3 retry is supported
export async function retryJobApi(
  jobId: number
): Promise<{ detail: string }> {
  const response = await apiClient.post(
    `/jobs/${jobId}/retry/`
  )
  return response.data
}

//api get method to fetch job results by job id
export async function getJobResults(
  jobId: number
): Promise<JobResult[]> {
  const response = await apiClient.get(
    `/jobs/${jobId}/results/`
  )
  return response.data
}
