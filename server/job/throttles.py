from rest_framework.throttling import ScopedRateThrottle

class JobCreateThrottle(ScopedRateThrottle):
    scope = "job_create"
