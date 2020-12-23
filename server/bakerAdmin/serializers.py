import base64
from django.contrib.auth.models import Group, GroupManager
from django.contrib.auth import get_user_model
from django.contrib.sites.shortcuts import get_current_site
from django.contrib.auth.tokens import default_token_generator
from django.conf import settings
from rest_framework import serializers
from rest_framework.authtoken.models import Token
from bakerAdmin.models import *
from sellerMenu.models import *
from datetime import datetime

from user.models import Users

User = get_user_model()



class AdminLoginSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=False, allow_blank=True, write_only=True)
    email = serializers.EmailField(required=True, write_only=True, label="Email Address")
    # phone_no = serializers.CharField(required=True, write_only=True, max_length=10, label="Mobile Number")
    token = serializers.CharField(allow_blank=True, read_only=True)
    password = serializers.CharField(required=True, write_only=True, style={'input_type': 'password'})

    class Meta(object):
        many = True
        model = Users
        fields = ['id', 'phone_no', 'email', 'username', 'password', 'token', 'first_name', 'last_name', 'email',
                  'is_superuser', 'is_active', 'is_staff', 'last_login']

class VendorListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class StateViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = States
        fields = "__all__"

class CityViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cities
        fields = "__all__"

class AreaViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = "__all__"

class StateListSerializer(serializers.ModelSerializer):
    class Meta:
        model = States
        fields  = ['id','state_name']

class CityListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cities
        fields  = ['id','city_name','state_id']


class AreaListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields  = ['id','area_name','pin_code','city_id','state_id']