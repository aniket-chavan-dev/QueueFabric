import time
from django.utils import timezone

from django.core.management.base import BaseCommand
from django.core.mail import EmailMessage
from django.db import transaction
from django.utils import timezone
from django.db.models import F

from job.models import Job, JobResult, JobStatus


class Command(BaseCommand):
    help = "Background worker to execute pending jobs"

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("Worker started"))

        while True:
            job = self.fetch_job()

            if not job:
                time.sleep(2)  
                continue

            self.execute_job(job)

    
    def fetch_job(self):
        with transaction.atomic():
            job = (
                Job.objects
                .select_for_update(skip_locked=True)
                .filter(
                    status=JobStatus.PENDING,
                    attempts__lt=F("max_attempts"),
                )
                .order_by("created_at")
                .first()
            )

            if not job:
                return None

            job.attempts += 1
            job.status = JobStatus.RUNNING

            job.save(update_fields=["attempts", "status"])

            return job
            

    def execute_job(self, job):
        start_time = time.perf_counter()  

        try:
            result = self.run_task(job)

            execution_time_ms = int(
                (time.perf_counter() - start_time) * 1000
            )

            JobResult.objects.create(
                job=job,
                output=result,
                execution_time_ms=execution_time_ms,
                completed_at=timezone.now()
            )

            job.status = JobStatus.COMPLETE
            job.save(update_fields=['status'])

            self.stdout.write(
                self.style.SUCCESS(
                    f"Job {job.id} completed in {execution_time_ms} ms"
                )
            )

        except Exception as e:
            execution_time_ms = int(
                (time.perf_counter() - start_time) * 1000
            )

            JobResult.objects.create(
                job=job,
                error=str(e),
                execution_time_ms=execution_time_ms,
                completed_at=timezone.now()
            )

            if job.attempts >= job.max_attempts:
                job.status = JobStatus.FAILED
            else:
                job.status = JobStatus.PENDING

            job.save(update_fields=["status"])

            self.stderr.write(
                self.style.ERROR(
                    f"Job {job.id} failed "
                    f"(attempt {job.attempts}/{job.max_attempts}): {e}"
                )
            )


    def run_task(self, job):
        if job.job_type == "email": #here for this instance of time we send only email in future we add more
            return self.send_email(job.payload)
        

        raise ValueError(f"Unknown job type: {job.job_type}")


    def send_email(self, payload):
        """
        here we expect this payload from frontend to send email
        {
            "to": ["user@gmail.com"],
            "subject": "Hello",
            "body": "Welcome"
        }
        """

        if not payload:
            raise ValueError("Email payload is empty")

        to = payload.get("to")
        subject = payload.get("subject")
        body = payload.get("body")

        if not to or not subject or not body:
            raise ValueError("Email payload missing required fields")

        email = EmailMessage(
            subject=subject,
            body=body,
            to=to,
        )

        email.send(fail_silently=False)

        print(f"Email sent to {to} with subject '{subject}'")

        return {
            "message": "Email sent successfully",
            "to": to,
            "subject": subject
        }
