from django.urls import path
from .views import UserRagistration,UserLogin,PasswordResetRequestView,PasswordResetConfirmView,UserDetailView


urlpatterns = [
    path("register/",UserRagistration.as_view()),
    path("login/",UserLogin.as_view()),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path("detail/",UserDetailView.as_view()),
]
