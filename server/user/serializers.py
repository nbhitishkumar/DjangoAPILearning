import base64
from django.contrib.auth.models import Group, GroupManager
from django.contrib.auth import get_user_model
from django.contrib.sites.shortcuts import get_current_site
from django.contrib.auth.tokens import default_token_generator
from django.conf import settings
from rest_framework import serializers
from rest_framework.authtoken.models import Token
from user.models import *
from datetime import datetime

User = get_user_model()


class LoginSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=False, allow_blank=True, write_only=True)
    # email = serializers.EmailField(required=True, write_only=True, label="Email Address")
    phone_no = serializers.CharField(required=True, write_only=True, max_length=10, label="Mobile Number")
    token = serializers.CharField(allow_blank=True, read_only=True)
    password = serializers.CharField(required=True, write_only=True, style={'input_type': 'password'})

    class Meta(object):
        many = True
        model = Users
        fields = ['id', 'phone_no', 'email', 'username', 'password', 'token', 'first_name', 'last_name', 'email',
                  'is_superuser', 'is_active', 'is_staff', 'last_login']

class LoginOtpSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=False, allow_blank=True, write_only=True)
    phone_no = serializers.CharField(required=True, write_only=True, max_length=10, label="Mobile Number")
    token = serializers.CharField(allow_blank=True, read_only=True)

    class Meta(object):
        many = True
        model = Users
        fields = ['id', 'phone_no', 'email', 'username', 'password', 'token', 'first_name', 'last_name', 'email',
                  'is_superuser', 'is_active', 'is_staff', 'last_login']



class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(required=True, allow_blank=False, max_length=200)
    phone_no = serializers.CharField(required=True, allow_blank=False, max_length=20)
    email = serializers.CharField(required=True, allow_blank=False, max_length=200)
    first_name = serializers.CharField(required=True, allow_blank=False, max_length=200)
    last_name = serializers.CharField(required=True, allow_blank=False, max_length=200)

    class Meta:
        model = get_user_model()
        fields = ['email', 'phone_no', 'password', 'first_name', 'last_name']


class SellerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = "__all__"


class EmailViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailCodeVerification
        fields ="__all__"


class MobileViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = OTP
        fields = "__all__"

class AccountViewSerializer(serializers.ModelSerializer):
    class MeTA:
        model = Users
        fields = ['phone_no']
