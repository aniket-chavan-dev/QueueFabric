from django.db import transaction
from django.shortcuts import get_object_or_404

from rest_framework import status, permissions, mixins
from rest_framework.viewsets import GenericViewSet
from rest_framework.decorators import action
from rest_framework.response import Response

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter

from .models import Job, JobResult, JobStatus
from .serializer import JobSerializer, JobResultSerializer
from .pagination import JobPagination
from .throttles import JobCreateThrottle


class JobViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    GenericViewSet
):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = JobSerializer
    pagination_class = JobPagination
    throttle_classes = [] 

    #filtering query is status and type
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ["status", "job_type"]
    ordering_fields = ["created_at", "updated_at"]
    ordering = ["-created_at"]

    def get_queryset(self):
        return Job.objects.filter(user=self.request.user)

    def get_throttles(self):
        if self.action == "create":
            return [JobCreateThrottle()]
        return super().get_throttles()

   
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

   
    @action(detail=True, methods=["post"])
    def retry(self, request, pk=None):
        with transaction.atomic():
            job = get_object_or_404(
                Job.objects.select_for_update(),
                id=pk,
                user=request.user,
            )

            if job.status == JobStatus.RUNNING:
                return Response(
                    {"detail": "Job is currently running"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if job.attempts >= job.max_attempts:
                return Response(
                    {"detail": "Maximum retry attempts exceeded"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            job.attempts += 1
            job.status = JobStatus.PENDING
            job.save(update_fields=["attempts", "status"])

        return Response(
            {"detail": "Job re-queued successfully"},
            status=status.HTTP_200_OK,
        )

   
    @action(detail=True, methods=["get"])
    def results(self, request, pk=None):
        job = get_object_or_404(Job, id=pk, user=request.user)
        results = JobResult.objects.filter(job=job).order_by("-completed_at")

        serializer = JobResultSerializer(results, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
