from rest_framework.views import APIView
from .models import User
from .serialize import UserRagisterationserializer,PasswordResetRequestSerializer, PasswordResetConfirmSerializer, UserSerializer
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from .utilities import get_tokens_for_user,send_password_reset_email
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import smart_bytes, force_str, DjangoUnicodeDecodeError
from django.conf import settings
from rest_framework.permissions import IsAuthenticated


class UserRagistration(APIView):
    def post(self,req):
        serializer = UserRagisterationserializer(data=req.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            token = get_tokens_for_user(user)
            return Response({'msg' : 'Ragistration successfull','access_token' : token['access'],'refresh_token' : token['refresh'],'user' : {
                'email' : user.email,
                'id' : user.id
            }},status=status.HTTP_201_CREATED)
        return Response({'error':serializer.errors},status=status.HTTP_400_BAD_REQUEST)
    

class UserLogin(APIView):
    def post(self,req):
        email = req.data.get('email')
        password = req.data.get('password')
        user = authenticate(req,email = email,password = password)
        if user is not None:
            token = get_tokens_for_user(user)
            user_ser = UserSerializer(user)
            return Response({'msg' : 'login successful','access_token' : token['access'],'refresh_token' : token['refresh'], 'user' : user_ser.data },status=status.HTTP_200_OK)
        return Response({"msg" : "invalid email and password"},status=status.HTTP_400_BAD_REQUEST)

class UserDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self,req):
        user = req.user
        user_ser = UserSerializer(user)
        return Response(user_ser.data,status=status.HTTP_200_OK)
       


class PasswordResetRequestView(APIView):
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email'].lower()

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Don’t reveal existence of email
            return Response({"detail": "If the email exists, a reset link has been sent."}, status=status.HTTP_200_OK)

        token_generator = PasswordResetTokenGenerator()
        uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
        token = token_generator.make_token(user)

        reset_link = f"{settings.FRONTEND_URL}/reset-password/{uidb64}/{token}"

        try:
            send_password_reset_email(user.email, reset_link)
        except Exception:
            return Response({"detail": "Failed to send email. Try again later."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"detail": "If the email exists, a reset link has been sent."}, status=status.HTTP_200_OK)


class PasswordResetConfirmView(APIView):
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        uidb64 = serializer.validated_data['uidb64']
        token = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=uid)
        except (DjangoUnicodeDecodeError, User.DoesNotExist):
            return Response({"detail": "Invalid link."}, status=status.HTTP_400_BAD_REQUEST)

        token_generator = PasswordResetTokenGenerator()
        if not token_generator.check_token(user, token):
            return Response({"detail": "Invalid or expired link."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({"detail": "Password reset successful."}, status=status.HTTP_200_OK)
