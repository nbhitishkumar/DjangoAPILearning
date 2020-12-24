from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from datetime import datetime
from django.utils import timezone
from user.utils import SoftDeleteManager


# Create your models here.

class Users(AbstractUser):
    phone_no = models.CharField(max_length=20, default="", blank=True)
    is_phone_verified = models.BooleanField(default=False, verbose_name='Phone Verification')
    is_email_verified = models.BooleanField(default=True, verbose_name='Email Verification')
    verified_code = models.CharField(max_length=30)
    reset_password = models.BooleanField(default=False)
    address = models.CharField(max_length=255, default="", blank=True, null=True)
    profile_image = models.CharField(max_length=225, blank=True, null=True)
    latitude = models.CharField(max_length=255, null=True)
    longitude = models.CharField(max_length=255, null=True)
    created_date = models.DateTimeField(default=datetime.now, blank=True)
    modified_date = models.DateTimeField(default=datetime.now, blank=True)
    is_blocked = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    owner_name = models.CharField(max_length=255, blank=True, null=True)
    shop_name = models.CharField(max_length=255, blank=True, null=True)
    gstin_present = models.CharField(max_length=255, blank=True, null=True)
    gstin_number = models.CharField(max_length=255, blank=True, null=True)
    registration_date = models.DateTimeField(null=True, blank=True)
    gst_state = models.CharField(max_length=255, blank=True, null=True)
    gst_type = models.CharField(max_length=255, blank=True, null=True)
    fssai_number = models.IntegerField(default=0, null=True)
    fssai_reg_name = models.CharField(max_length=255, blank=True, null=True)
    fssai_exp_date = models.DateTimeField(null=True, blank=True)
    fssai_address = models.CharField(max_length=255, default="", blank=True, null=True)
    shop_city = models.CharField(max_length=255, blank=True, null=True)
    shop_landmark = models.CharField(max_length=255, null=True)
    pin_code = models.IntegerField(default=0, null=True)
    shop_image = models.CharField(max_length=225, blank=True, null=True)
    aadhaar_front_image = models.CharField(max_length=225, blank=True, null=True)
    gstin_image = models.CharField(max_length=225, blank=True, null=True)
    fssai_image = models.CharField(max_length=225, blank=True, null=True)
    user_type = models.IntegerField(default=0, null=True)
    account  = models.CharField(max_length=225, blank=True, null=True)
    is_shop_verified = models.BooleanField(default=False)
    aadhaar_back_image = models.CharField(max_length=225, blank=True, null=True)
    owner_image = models.CharField(max_length=225, blank=True, null=True)
    floor_no = models.IntegerField(default=0, null=True)
    mall_name = models.CharField(max_length=225, blank=True, null=True)
    state = models.CharField(max_length=225, blank=True, null=True)
    shop_area = models.CharField(max_length=225, blank=True, null=True)
    shop_comment = models.CharField(max_length=225, blank=True, null=True)
    owner_comment = models.CharField(max_length=225, blank=True, null=True)
    fssai_comment = models.CharField(max_length=225, blank=True, null=True)
    gstin_comment = models.CharField(max_length=225, blank=True, null=True)
    aadhar_front_comment = models.CharField(max_length=225, blank=True, null=True)
    aadhar_back_comment = models.CharField(max_length=225, blank=True, null=True)

    class Meta:
        db_table = 'auth_user'

    def get_name(self):
        return self.first_name + ' ' + self.last_name

    def __str__(self):
        return self.username

    # Mobile otp Verification


class OTP(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user_otp')
    mobile = models.CharField(max_length=15, blank=True, null=True)
    otp = models.CharField(max_length=100, blank=True, null=True)
    created_date = models.DateTimeField(default=datetime.now, blank=True)
    modified_date = models.DateTimeField(default=datetime.now, blank=True)
    is_verified = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)

    class Meta:
        db_table = 'otp'

class EmailCodeVerification(models.Model):
	user 			    = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user_verification')
	email 			    = models.CharField(max_length=255, blank=True, null=True)
	verification_code   = models.CharField(max_length=20, blank=True, null=True)
	is_varified 		= models.BooleanField(default=False)
	is_deleted 			= models.BooleanField(default=False)
	created_date 		= models.DateTimeField(default=datetime.now, blank=True)
	modified_date 		= models.DateTimeField(default=datetime.now, blank=True)


