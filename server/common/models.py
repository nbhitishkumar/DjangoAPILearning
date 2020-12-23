from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from datetime import datetime
from django.utils import timezone
from user.utils import SoftDeleteManager


# Create your models here.

### Create New Category Based On User_ID

class CommentBox(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user_comment')
    owner_image = models.CharField(max_length=255, blank=True, null=True)
    shop_image = models.CharField(max_length=225, blank=True, null=True)
    aadhaar_front_image = models.CharField(max_length=225, blank=True, null=True)
    aadhaar_back_image = models.CharField(max_length=225, blank=True, null=True)
    gstin_image = models.CharField(max_length=225, blank=True, null=True)
    fssai_image = models.CharField(max_length=225, blank=True, null=True)
    created_date = models.DateTimeField(default=datetime.now, blank=True)
    modified_date = models.DateTimeField(default=datetime.now, blank=True)
    message_for = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = 'comment_box'
