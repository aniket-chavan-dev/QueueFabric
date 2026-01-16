from rest_framework import serializers
from .models import Job, JobResult


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = [
            'id',
            'job_type',
            'payload',
            'status',
            'attempts',
            'max_attempts',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'status',
            'attempts',
            'created_at',
            'updated_at',
        ]

    def validate_payload(self, value):
        if value is not None and not isinstance(value, dict):
            raise serializers.ValidationError(
                "Payload must be a valid JSON object"
            )
        return value

    def validate(self, attrs):
        job_type = attrs.get("job_type")
        payload = attrs.get("payload") or {}

        if job_type == "email":
            required = {"to", "subject", "body"}
            missing = required - payload.keys()
            if missing:
                raise serializers.ValidationError(
                    f"Missing fields for email job: {missing}"
                )

        return attrs

    def create(self, validated_data):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError("Authentication required")

        validated_data["user"] = request.user
        return super().create(validated_data)


class JobResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobResult
        fields = [
            'id',
            'job',
            'output',
            'error',
            'execution_time_ms',
            'completed_at',
        ]
        read_only_fields = [
            'id',
            'job',
            'completed_at',
        ]


class JobWithResultsSerializer(JobSerializer):
    results = JobResultSerializer(many=True, read_only=True)

    class Meta(JobSerializer.Meta):
        fields = JobSerializer.Meta.fields + ['results']
