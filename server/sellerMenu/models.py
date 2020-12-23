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

class SellerCategory(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user_category')
    category_name = models.CharField(max_length=255, blank=True, null=True)
    category_des = models.CharField(max_length=255, blank=True, null=True)
    created_date = models.DateTimeField(default=datetime.now, blank=True)
    category_image = models.CharField(max_length=225, blank=True, null=True)
    modified_date = models.DateTimeField(default=datetime.now, blank=True)
    is_deleted = models.BooleanField(default=False)

    class Meta:
        db_table = 'seller_category'

# time(hour = 0, minute = 0, second = 0)
# d = datetime.time(10, 33, 45)

class SellerItem(models.Model):
    category = models.ForeignKey(SellerCategory, on_delete=models.CASCADE, related_name='item_category_id', null=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user_item')
    item_name = models.CharField(max_length=255, blank=True, null=True)
    item_description = models.CharField(max_length=255, blank=True, null=True)
    item_image = models.CharField(max_length=225, blank=True, null=True)
    item_preparing_time = models.TimeField(blank=True)
    item_delivery_time = models.TimeField(blank=True)
    item_price = models.IntegerField(default=0, null=True)
    created_date = models.DateTimeField(default=datetime.now, blank=True)
    modified_date = models.DateTimeField(default=datetime.now, blank=True)
    is_deleted = models.BooleanField(default=False)

    class Meta:
        db_table = 'seller_item'
