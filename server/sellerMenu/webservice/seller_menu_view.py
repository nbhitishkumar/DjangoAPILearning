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
from sellerMenu.serializers import *
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


class SellerCategoryMenuView(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        user = request.user
        user_id = user.id
        response_data = {}
        rs = SellerCategory.objects.filter(user_id=user_id, is_deleted=False)
        if rs:
            category_serialize = SellerCategorySerializer(rs, many=True)
            response_data['status'] = 1
            response_data['msg'] = 'Successfully get seller details'
            response_data['category_details'] = category_serialize.data
            http_status_code = 200
        else:
            response_data['status'] = 0
            response_data['msg'] = 'No data found'
            response_data['category_details'] = []
            http_status_code = 404
        return Response(response_data, status=http_status_code)

    def post(self, request):
        user = request.user
        user_id = user.id
        requestdata = request.data
        response = {}
        rs = User.objects.filter(id=user_id,is_superuser=True, is_active=True, is_blocked=False, is_deleted=False).first()
        if rs:
            check_Category = SellerCategory.objects.filter(category_name=requestdata['category_name'],is_deleted=False).count()
            if check_Category > 0:
                response['status'] = 0
                response['msg'] = 'Category Already Added'
                http_status_code = 404
            else:
                obj = SellerCategory.objects.create(
                    user_id=user_id,
                    category_name=requestdata['category_name'],
                    created_date=timezone.now(),
                    modified_date=timezone.now(),
                )
                response['status'] = 1
                response['msg'] = 'New Category Added'
                http_status_code = 200
        else:
            response['status'] = 0
            response['msg'] = 'No Access'
            http_status_code = 404
        return JsonResponse(response, status=http_status_code)

    def put(self, request):
        user = request.user
        user_id = user.id
        requestdata = request.data
        response = {}
        rs = User.objects.filter(id=user_id,is_superuser=True, is_active=True, is_blocked=False, is_deleted=False).first()
        if rs:
            check_category = SellerCategory.objects.filter(id=requestdata['category_id'], is_deleted=False)
            if check_category:
                obj = SellerCategory.objects.filter(id=requestdata['category_id']).update(
                    category_name=requestdata['category_name'],
                    modified_date=timezone.now(),
                )
                response['status'] = 1
                response['msg'] = 'Category Name Updated'
                http_status_code = 201
            else:
                response['status'] = 0
                response['msg'] = 'Category Not Found'
                http_status_code = 404
        else:
            response['status'] = 0
            response['msg'] = 'User Not Found'
            http_status_code = 404
        return JsonResponse(response, status=http_status_code)


class SellerItemMenuView(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        response_data = {}
        user = request.user
        user_id = user.id
        requestdata = request.data
        rs = User.objects.filter(id=user_id, is_active=True, is_blocked=False, is_deleted=False).first()
        if rs:
            if rs.is_shop_verified:
                category_data = SellerItem.objects.filter(category_id=requestdata['category_id'], is_deleted=False)
                if category_data:
                    check_itemName = SellerItem.objects.filter(item_name=requestdata['item_name'],
                                                               is_deleted=False).count()
                    if check_itemName:
                        response_data['status'] = 0
                        response_data['msg'] = 'Category Already Added'
                        http_status_code = 404
                    else:
                        obj = SellerItem.objects.create(
                            user_id=user_id,
                            item_name=requestdata['item_name'],
                            item_price=requestdata['item_price'],
                            item_description=requestdata['item_description'],
                            item_preparing_time=requestdata['item_preparing_time'],
                            item_delivery_time=requestdata['item_delivery_time'],
                            created_date=timezone.now(),
                            modified_date=timezone.now(),
                            category_id=requestdata['category_id'],
                            item_image=requestdata
                        )
                        response_data['status'] = 1
                        response_data['msg'] = 'New Item Added'
                        http_status_code = 200

            else:
                response_data['status'] = 1
                response_data['msg'] = 'User Found'
                http_status_code = 404
        else:
            response_data['status'] = 0
            response_data['msg'] = 'User Not Found'
            http_status_code = 404
        return Response(response_data, status=http_status_code)


#### Get List of all Seller Category



class SellerItemList(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        user = request.user
        user_id = user.id
        response_data = {}
        rs = SellerItem.objects.filter(user_id=user_id, is_deleted=False)
        if rs:
            item_serialize = SellerItemSerializer(rs, many=True)
            for details in item_serialize.data:
                category_name = details['category_name']
            response_data['status'] = 1
            response_data['msg'] = 'Successfully get seller details'
            response_data['item_details'] = item_serialize.data
            http_status_code = 200
        else:
            response_data['status'] = 0
            response_data['msg'] = 'No data found'
            response_data['item_details'] = []
            http_status_code = 404
        return Response(response_data, status=http_status_code)
