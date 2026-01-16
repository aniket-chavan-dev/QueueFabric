from django.db import models
from account.models import User


class JobStatus(models.TextChoices):
    PENDING = 'pending', 'Pending'
    RUNNING = 'running', 'Running'
    COMPLETE = 'complete', 'Complete'
    FAILED = 'failed', 'Failed'


class JobType(models.TextChoices):
    EMAIL = 'email', 'Email'
    PDF = 'pdf', 'PDF'
    CODE = 'code', 'Code Execution'


class Job(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    job_type = models.CharField(
        max_length=50,
        choices=JobType.choices
    )

    payload = models.JSONField(null=True, blank=True)

    status = models.CharField(
        max_length=20,
        choices=JobStatus.choices,
        default=JobStatus.PENDING
    )

    attempts = models.PositiveSmallIntegerField(default=0)
    max_attempts = models.PositiveSmallIntegerField(default=3)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
        ]


class JobResult(models.Model):
    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name='results'
    )

    output = models.JSONField(null=True, blank=True)
    error = models.TextField(null=True, blank=True)
    execution_time_ms = models.PositiveIntegerField(null=True, blank=True)
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-completed_at']
