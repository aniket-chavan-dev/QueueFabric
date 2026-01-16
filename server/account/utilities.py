from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from django.core.mail import send_mail
from django.conf import settings


def get_tokens_for_user(user):
    if not user.is_active:
      raise AuthenticationFailed("User is not active")

    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

# accounts/utils.py


def send_password_reset_email(to_email, reset_link):
    subject = "Password Reset Request"
    message = f"Click the link below to reset your password:\n\n{reset_link}\n\nIf you didn’t request this, ignore this email."
    from_email = settings.DEFAULT_FROM_EMAIL
    send_mail(subject, message, from_email, [to_email], fail_silently=False)
