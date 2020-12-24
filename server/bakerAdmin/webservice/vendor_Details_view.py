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
from bakerAdmin.serializers import *
import django.db.models
from django.core.mail import send_mail
import random
from django.utils import timezone
import os
import json


class JSONResponse(HttpResponse):
    """ An HttpResponse that renders its content into JSON. """

    def __init__(self, data, **kwargs):
        content = JSONRenderer().render(data)
        kwargs['content_type'] = 'application/json'
        super(JSONResponse, self).__init__(content, **kwargs)


class VendorDetailsView(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request):
        user = request.user
        response_data = {}
        rs = User.objects.filter(id=user.id, is_superuser=True ,is_blocked=False, is_deleted=False)
        if rs:
            vendor_list = User.objects.filter(is_blocked=False, is_deleted=False,user_type=2)
            if vendor_list:
                serializers = VendorListSerializer(vendor_list, many=True)
                response_data['status'] = 1
                response_data['message'] = 'Data found successfully.'
                response_data['vendorList'] = serializers.data
                return JsonResponse(response_data, status=200)
            else:
                response_data['status'] = 0
                response_data['message'] = 'No Vendor Registered'
                response_data['vendorList'] = []
        else:
            response_data['status'] = 0
            response_data['message'] = 'No Access'
            return JsonResponse(response_data, status=200)

    def put(self, request):
        user = request.user
        response_data = {}
        requestData = request.data
        rs = User.objects.filter(id=user.id, is_superuser=True ,is_blocked=False, is_deleted=False)
        if rs:
            delete_list = User.objects.filter(id=requestData['user_id'],user_type=2).update(is_deleted=requestData['is_deleted'],modified_date=timezone.now())
            response_data['status'] = 1
            response_data['message'] = 'Account Deleted'
            return JsonResponse(response_data, status=200)
        else:
            response_data['status'] = 0
            response_data['message'] = 'No Access'
            return JsonResponse(response_data, status=200)



class VendorInfoView(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)

    def post(self,request):
        user = request.user
        user_id = user.id
        profile_image_name = ''
        shop_image_name = ''
        aadhaar_front_image_name = ''
        aadhaar_back_image_name = ''
        owner_image_name = ''
        gstin_image_name = ''
        fssal_image_name = ''
        response_data = {}
        requestData = request.data
        rs=User.objects.filter(id=user.id, is_superuser=True ,is_blocked=False, is_deleted=False)
        if rs:
            vendor_info = User.objects.filter(id=requestData['user_id'], is_deleted=False,user_type=2)
            user_serialize = VendorListSerializer(vendor_info, many=True)
            for details in user_serialize.data:
                profile_image_name = details['profile_image']
                if profile_image_name is not None:
                    if os.path.exists('media/profile_image/' + profile_image_name):
                        base64_image = encode_image_base64(settings.MEDIA_ROOT + '/profile_image/' + profile_image_name)
                        details['profile_image'] = base64_image
                shop_image_name= details['shop_image']
                if shop_image_name is not None:
                    if os.path.exists('media/shop_image/' + shop_image_name):
                        base64_image = encode_image_base64(settings.MEDIA_ROOT+ '/shop_image/' + shop_image_name)
                        details['shop_image'] = base64_image
                owner_image_name = details['owner_image']
                if owner_image_name is not None:
                    if os.path.exists('media/owner_image/' + owner_image_name):
                        base64_image = encode_image_base64(settings.MEDIA_ROOT+ '/owner_image/' + owner_image_name)
                        details['owner_image'] = base64_image
                aadhaar_back_image_name = details['aadhaar_back_image']
                if aadhaar_back_image_name is not None:
                    if os.path.exists('media/aadhaar_back_image/' + aadhaar_back_image_name):
                        base64_image = encode_image_base64(settings.MEDIA_ROOT+ '/aadhaar_back_image/' + aadhaar_back_image_name)
                        details['aadhaar_back_image'] = base64_image
                aadhaar_front_image_name = details['aadhaar_front_image']
                if aadhaar_front_image_name is not None:
                    if os.path.exists('media/aadhaar_front_image/' + aadhaar_front_image_name):
                        base64_image = encode_image_base64(settings.MEDIA_ROOT+ '/aadhaar_front_image/' + aadhaar_front_image_name)
                        details['aadhaar_front_image'] = base64_image
                gstin_image_name = details['gstin_image']
                if gstin_image_name is not None:
                    if os.path.exists('media/gstin_image/' + gstin_image_name):
                        base64_image = encode_image_base64(settings.MEDIA_ROOT+ '/gstin_image/' + gstin_image_name)
                        details['gstin_image'] = base64_image
                fssal_image_name = details['fssai_image']
                if fssal_image_name is not None:
                    if os.path.exists('media/fssai_image/' + fssal_image_name):
                        base64_image = encode_image_base64(settings.MEDIA_ROOT+ '/fssai_image/' + fssal_image_name)
                        details['fssai_image'] = base64_image
            response_data['status'] = 1
            response_data['message'] = 'Vendor Info'
            response_data['vendorInfo'] = user_serialize.data
            return Response(response_data, status=200)
        else:
            response_data['status'] = 0
            response_data['message'] = 'This Vendor is not present in our database'
            response_data['vendorInfo'] = []
            return Response(response_data, status=200)

class CommentView(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)

    def put(self,request):
        user = request.user
        user_id = user.id
        requestData = request.data
        response_data = {}
        com= requestData['box_name']
        rs=User.objects.filter(id=user.id, is_superuser=True ,is_blocked=False, is_deleted=False)
        if rs:
            if com == 'shop_comment':
                User.objects.filter(id=requestData['user_id'],user_type=2).update(shop_comment=requestData['message'],modified_date=timezone.now())
            elif com == 'owner_comment':
                User.objects.filter(id=requestData['user_id'],user_type=2).update(owner_comment=requestData['message'],modified_date=timezone.now())
            elif com == 'fssai_comment':
                User.objects.filter(id=requestData['user_id'],user_type=2).update(fssai_comment=requestData['message'],modified_date=timezone.now())
            elif com == 'gstin_comment':
                User.objects.filter(id=requestData['user_id'],user_type=2).update(gstin_comment=requestData['message'],modified_date=timezone.now())
            elif com == 'aadhar_front_comment':
                User.objects.filter(id=requestData['user_id'],user_type=2).update(aadhar_front_comment=requestData['message'],modified_date=timezone.now())
            elif com == 'aadhar_back_comment':
                User.objects.filter(id=requestData['user_id'],user_type=2).update(aadhar_back_comment=requestData['message'],modified_date=timezone.now())
            response_data['status'] = 1
            response_data['message'] = 'Comment Sent'
            return JsonResponse(response_data, status=200)
        else:
            response_data['status'] = 0
            response_data['message'] = 'No Access'
            return JsonResponse(response_data, status=200)


def encode_image_base64(full_path):
    image = ''
    if full_path != "":
        with open(full_path, 'rb') as imgFile:
            image = base64.b64encode(imgFile.read())
    return image