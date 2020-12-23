import base64
from django.contrib.auth.models import Group, GroupManager
from django.contrib.auth import get_user_model
from django.contrib.sites.shortcuts import get_current_site
from django.contrib.auth.tokens import default_token_generator
from django.conf import settings
from rest_framework import serializers
from rest_framework.authtoken.models import Token

from common.models import *
from datetime import datetime

User = get_user_model()


class CommentBoxSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentBox
        fields = "__all__"


