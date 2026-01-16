from rest_framework import serializers
from .models import User
from django.core.exceptions import ValidationError
import re
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.auth import get_user_model
from django.utils.encoding import smart_str, force_str, smart_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode



class UserRagisterationserializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['id','email','password']
    
    def validate_password(self, value):
    # Minimum length
        if len(value) < 8:
            raise ValidationError("Password must be at least 8 characters long.")
        
        # At least one number
        if not re.search(r"\d", value):
            raise ValidationError("Password must contain at least one number.")
        
        # At least one letter
        if not re.search(r"[A-Za-z]", value):
            raise ValidationError("Password must contain at least one letter.")
        
        # At least one special character
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", value):
            raise ValidationError("Password must contain at least one special character.")
        
        return value
    
    def create(self, validated_data):
          user = User.objects.create_user(**validated_data)
          user.save()
          return user
    
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['id','email','password']





class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

class PasswordResetConfirmSerializer(serializers.Serializer):
    uidb64 = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(min_length=8)

    def validate_new_password(self, value):
        # Hook into Django password validators
        from django.contrib.auth.password_validation import validate_password
        validate_password(value)
        return value
