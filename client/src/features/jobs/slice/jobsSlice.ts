import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { retryJobApi } from "../api/jobsApi";

import {
  listJobs,
  createJob,
  getJob,
  getJobResults,
  type ListJobsParams,
} from "../api/jobsApi";

import type {
  Job,
  JobResult,
  PaginatedJobsResponse,
  CreateJobPayload,
} from "../types/jobTypes";

export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async (params: ListJobsParams, { rejectWithValue }) => {
    try {
      return await listJobs(params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to load jobs");
    }
  }
);

export const createNewJob = createAsyncThunk(
  "jobs/createJob",
  async (payload: CreateJobPayload, { rejectWithValue }) => {
    try {
      return await createJob(payload);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Job creation failed");
    }
  }
);

export const fetchJobById = createAsyncThunk(
  "jobs/fetchJobById",
  async (jobId: number, { rejectWithValue }) => {
    try {
      return await getJob(jobId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to load job");
    }
  }
);

export const retryExistingJob = createAsyncThunk(
  "jobs/retryJob",
  async (jobId: number, { rejectWithValue }) => {
    try {
      return await retryJobApi(jobId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Retry failed");
    }
  }
);

export const fetchJobResults = createAsyncThunk(
  "jobs/fetchJobResults",
  async (jobId: number, { rejectWithValue }) => {
    try {
      return await getJobResults(jobId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to load results");
    }
  }
);

interface JobsState {
  list: Job[];
  count: number;
  next: string | null;
  previous: string | null;

  selectedJob: Job | null;
  results: JobResult[];

  filters: {
    status?: string;
    job_type?: string;
    ordering?: string;
    page: number;
  };

  loading: {
    list: boolean;
    create: boolean;
    detail: boolean;
    results: boolean;
  };

  error: string | null;
 
}

const initialState: JobsState = {
  list: [],
  count: 0,
  next: null,
  previous: null,

  selectedJob: null,
  results: [],

  filters: {
    page: 1,
  },

  loading: {
    list: false,
    create: false,
    detail: false,
    results: false,
  },

  error: null,
  
};

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<Partial<JobsState["filters"]>>) {
      state.filters = {
        ...state.filters,
        ...action.payload,
        page: action.payload.page ?? 1,
      };
    },
    clearSelectedJob(state) {
      state.selectedJob = null;
      state.results = [];
    },
   
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading.list = true;
        state.error = null;
      })
      .addCase(
        fetchJobs.fulfilled,
        (state, action: PayloadAction<PaginatedJobsResponse>) => {
          state.loading.list = false;
          state.list = action.payload.results;
          state.count = action.payload.count;
          state.next = action.payload.next;
          state.previous = action.payload.previous;
        }
      )
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading.list = false;
        let errData : { job_type: string | Array<string>}= action.payload as { job_type: string | Array<string>};
        state.error = errData.job_type ? Array.isArray(errData.job_type) ? errData.job_type.join(", ") : errData.job_type
        : "Failed to load jobs";
       
      });

    builder
      .addCase(createNewJob.pending, (state) => {
        state.loading.create = true;
        state.error = null;
      })
      .addCase(createNewJob.fulfilled, (state, action: PayloadAction<Job>) => {
        state.loading.create = false;
        state.list.unshift(action.payload);
      })
      .addCase(createNewJob.rejected, (state, action) => {
        state.loading.create = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchJobById.pending, (state) => {
        state.loading.detail = true;
      })
      .addCase(fetchJobById.fulfilled, (state, action: PayloadAction<Job>) => {
        state.loading.detail = false;
        state.selectedJob = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading.detail = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchJobResults.pending, (state) => {
        state.loading.results = true;
      })
      .addCase(
        fetchJobResults.fulfilled,
        (state, action: PayloadAction<JobResult[]>) => {
          state.loading.results = false;
          state.results = action.payload;
        }
      )
      .addCase(fetchJobResults.rejected, (state, action) => {
        state.loading.results = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearSelectedJob} = jobsSlice.actions;
export default jobsSlice.reducer;
