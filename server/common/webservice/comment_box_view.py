from django.http import HttpResponse
from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.contrib.sites.shortcuts import get_current_site
from django.contrib.sessions.models import Session
from django.utils.crypto import get_random_string
from django.conf import settings

from rest_framework import generics, permissions, status, views, mixins
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from django.http import JsonResponse
from django.http import HttpResponse

from datetime import datetime, timedelta
from user.serializers import *
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from common.serializers import *
import django.db.models
from django.core.mail import send_mail
import random
from django.utils import timezone
import os


class JSONResponse(HttpResponse):
    """ An HttpResponse that renders its content into JSON. """

    def __init__(self, data, **kwargs):
        content = JSONRenderer().render(data)
        kwargs['content_type'] = 'application/json'
        super(JSONResponse, self).__init__(content, **kwargs)


class CommentBoxView(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request, format=None):
        user = request.user
        user_id = user.id
        response_data = {}
        rs = User.objects.filter(id=user_id,is_superuser=True, is_active=True, is_blocked=False, is_deleted=False)
        if rs:
            category_serialize = SellerCategorySerializer(rs, many=True)
            response_data['status'] = 1
            response_data['msg'] = 'Successfully get seller details'
            response_data['category_details'] = category_serialize.data
            http_status_code = 200
        else:
            response_data['status'] = 0
            response_data['msg'] = 'No Access'
            http_status_code = 404
        return Response(response_data, status=http_status_code)

    def post(self, request):
        user = request.user
        user_id = user.id
        requestdata = request.data
        response = {}
        rs = User.objects.filter(id=user_id,is_superuser=True, is_active=True, is_blocked=False, is_deleted=False)
        if rs:
            save_db={}
            save_db['created_date'] = timezone.now()
            save_db['owner_image'] = requestdata[owner_image]
            save_db['shop_image'] = requestdata[shop_image]
            save_db['aadhaar_front_image']=requestdata[aadhaar_front_image]
            save_db['aadhaar_back_image'] = requestdata[aadhaar_back_image]
            save_db['gstin_image'] = requestdata[gstin_image]
            save_db['fssai_image']=requestdata[fssai_image]
            save_db['modified_date'] = timezone.now()
            save_db['user'] = user_id
            save_db['message_for'] = requestdata['message_for']
            serializer = CommentBoxSerializer(data=save_db)
            if serializer.is_valid():
                    comment = CommentBox.objects.filter(message_for=requestdata['message_for']).first()
                    if not comment:
                        serializer.save()
                        response['status'] = 1
                        response['msg'] = 'Comments Has Been Sent'
                        response['details'] = serializer.data
                        http_status_code = 200
                    else:
                        CommentBox.objects.filter(message_for=requestdata['message_for']).update(
                            owner_image=requestdata[owner_image],
                            shop_image=requestdata[owner_image],
                            aadhaar_front_image = requestdata[aadhaar_front_image],
                            aadhaar_back_image = requestdata[aadhaar_front_image],
                            gstin_image = requestdata[gstin_image],
                            fssai_image = requestdata[fssai_image],
                            modified_date = timezone.now()
                            )
                        response['status'] = 1
                        response['msg'] = 'Comm'
                        http_status_code = 200
                else:
                    response['status'] = 0
                    http_status_code = 404
        else:
            response['status'] = 0
            response['msg'] = 'No Access'
            http_status_code = 404
        return JsonResponse(response, status=http_status_code)

    