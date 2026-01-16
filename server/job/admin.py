from django.contrib import admin
from .models import *


# Register your models here.
@admin.register(Job)
class JobAdmin(admin.ModelAdmin) :
    list_display = ['id','job_type','status']


@admin.register(JobResult)
class JobAdmin(admin.ModelAdmin) :
    list_display = ['id','output','error']

