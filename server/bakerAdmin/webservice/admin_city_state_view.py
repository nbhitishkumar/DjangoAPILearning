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
from bakerAdmin.models import *
from user.serializers import *
from bakerAdmin.serializers import *
from datetime import datetime, timedelta
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
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


class StateListView(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request):
        response_data = {}
        qs = States.objects.filter(is_deleted=False, is_blocked=False)
        if qs.count() > 0:
            qs_data = StateListSerializer(qs, many=True)
            response_data['status'] = 1
            response_data['massage'] = 'Data found successfully'
            response_data['states'] = qs_data.data
        else:
            response_data['status'] = 0
            response_data['massage'] = 'Data not found'
            response_data['states'] = []
        return Response(response_data, status=200)


    def post(self, request):
        user = request.user
        response_data = {}
        rs = User.objects.filter(id=user.id, is_superuser=True ,is_blocked=False, is_deleted=False)
        if rs:
            check_state = States.objects.filter(state_name=request.data.get('state_name'), is_blocked=False, is_deleted=False)
            if not check_state:
                save_db={}
                save_db['created_by'] = user.id
                save_db['state_name'] = request.data.get('state_name')
                save_db['created_at'] = timezone.now()
                save_db['updated_at'] = timezone.now()
                serializer = StateViewSerializer(data=save_db)
                if serializer.is_valid():
                    serializer.save()
                    response_data['status'] = 1
                    response_data['massage'] = 'Data found successfully'
                    response_data['states'] = serializer.data
                else:
                    response_data['status'] = 0
                    response_data['massage'] = 'Data not found'
                    response_data['states'] = []
            else:
                response_data['status'] = 0
                response_data['massage'] = 'State Already Added'
                response_data['states'] = []
        else:
            response_data['status'] = 0
            response_data['massage'] = 'No Access'
        return Response(response_data, status=200)

class CityListView(generics.ListAPIView):
    def get(self, request):
        responce_data = {}
        qs = Cities.objects.filter(is_deleted=False, is_blocked=False)
        if qs.count() > 0:
            qs_data = CityListSerializer(qs, many=True)
            responce_data['status'] = 1
            responce_data['massage'] = 'Data found successfully'
            responce_data['cities'] = qs_data.data
        else:
            responce_data['status'] = 0
            responce_data['massage'] = 'Data not found'
            responce_data['cities'] = []
        return Response(responce_data, status=200)

    
    def post(self, request):
        user = request.user
        response_data = {}
        rs = User.objects.filter(id=user.id, is_superuser=True ,is_blocked=False, is_deleted=False)
        if rs:
            check_city = Cities.objects.filter(city_name=request.data.get('city_name'), is_blocked=False, is_deleted=False)
            if not check_city:
                save_db={}
                save_db['state'] = request.data.get('state')
                save_db['created_by'] = user.id
                save_db['city_name'] = request.data.get('city_name')
                save_db['created_at'] = timezone.now()
                save_db['updated_at'] = timezone.now()
                serializer = CityViewSerializer(data=save_db)
                if serializer.is_valid():
                    serializer.save()
                    response_data['status'] = 1
                    response_data['massage'] = 'Data found successfully'
                    response_data['cities'] = serializer.data
                else:
                    response_data['status'] = 0
                    response_data['massage'] = 'Data not found'
                    response_data['cities'] = []
            else:
                response_data['status'] = 1
                response_data['massage'] = 'City Already Added'
                response_data['cities'] = []
        else:
            response_data['status'] = 0
            response_data['massage'] = 'No Access'
        return Response(response_data, status=200)

class CityListViewById(generics.ListAPIView):    
    def post(self, request):
        user = request.user
        response_data = {}
        rs = User.objects.filter(id=user.id,is_blocked=False, is_deleted=False)
        if rs:
            qs = Cities.objects.filter(state_id=request.data.get('state_id'), is_blocked=False, is_deleted=False)
            if qs.count() > 0:
                qs_data = CityListSerializer(qs, many=True)
                response_data['status'] = 1
                response_data['massage'] = 'Data found successfully'
                response_data['area'] = qs_data.data
            else:
                response_data['status'] = 0
                response_data['massage'] = 'Data not found'
                response_data['area'] = []  
        else:
            response_data['status'] = 0
            response_data['massage'] = 'No Access'
        return Response(response_data, status=200)


class AreaListViewById(generics.ListAPIView):    
    def post(self, request):
        user = request.user
        response_data = {}
        rs = User.objects.filter(id=user.id,is_blocked=False, is_deleted=False)
        if rs:
            qs = Area.objects.filter(city_id=request.data.get('city_id'), is_blocked=False, is_deleted=False)
            if qs.count() > 0:
                qs_data = AreaListSerializer(qs, many=True)
                response_data['status'] = 1
                response_data['massage'] = 'Data found successfully'
                response_data['area'] = qs_data.data
            else:
                response_data['status'] = 0
                response_data['massage'] = 'Data not found'
                response_data['area'] = []  
        else:
            response_data['status'] = 0
            response_data['massage'] = 'No Access'
        return Response(response_data, status=200)


class PinCocdeViewById(generics.ListAPIView):    
    def post(self, request):
        user = request.user
        response_data = {}
        rs = User.objects.filter(id=user.id,is_blocked=False, is_deleted=False)
        print(request.data.get('area_id'))
        if rs:
            qs = Area.objects.filter(id=request.data.get('area_id'), is_blocked=False, is_deleted=False)
            if qs:
                for i in qs:
                    pin_code =i.pin_code
                response_data['status'] = 1
                response_data['massage'] = 'Data found successfully'
                response_data['area'] = pin_code
            else:
                response_data['status'] = 0
                response_data['massage'] = 'Data not found'
                response_data['area'] = []  
        else:
            response_data['status'] = 0
            response_data['massage'] = 'No Access'
        return Response(response_data, status=200)


class AreaListView(generics.ListAPIView):
    def get(self, request):
        responce_data = {}
        qs =Area.objects.filter(is_deleted=False, is_blocked=False)
        if qs.count() > 0:
            qs_data = AreaListSerializer(qs, many=True)
            responce_data['status'] = 1
            responce_data['massage'] = 'Data found successfully'
            responce_data['area'] = qs_data.data
        else:
            responce_data['status'] = 0
            responce_data['massage'] = 'Data not found'
            responce_data['area'] = []
        return Response(responce_data, status=200)

    
    def post(self, request):
        user = request.user
        response_data = {}
        rs = User.objects.filter(id=user.id, is_superuser=True ,is_blocked=False, is_deleted=False)
        if rs:
            check_city = Area.objects.filter(city_name=request.data.get('area_name'), is_blocked=False, is_deleted=False)
            if not check_city:
                save_db={}
                save_db['state'] = request.data.get('state')
                save_db['city'] = request.data.get('city')
                save_db['created_by'] = user.id
                save_db['area_name'] = request.data.get('area_name')
                save_db['pin _code'] = request.data.get('pin _code')
                save_db['created_at'] = timezone.now()
                save_db['updated_at'] = timezone.now()
                serializer = AreaViewSerializer(data=save_db)
                if serializer.is_valid():
                    serializer.save()
                    response_data['status'] = 1
                    response_data['massage'] = 'Data found successfully'
                    response_data['area'] = serializer.data
                else:
                    response_data['status'] = 0
                    response_data['massage'] = 'Data not found'
                    response_data['area'] = []
            else:
                response_data['status'] = 1
                response_data['massage'] = 'City Already Added'
                response_data['area'] = []
        else:
            response_data['status'] = 0
            response_data['massage'] = 'No Access'
        return Response(response_data, status=200)

class AddNewArea(generics.ListAPIView):
    def get(self, request):
        response_data = {}
        user = request.user
        rs = User.objects.filter(id=user.id, is_superuser=True ,is_blocked=False, is_deleted=False)
        if rs:
            qs =Area.objects.filter(is_deleted=False, is_blocked=False)
            if qs.count() > 0:
                qs_data = AreaListSerializer(qs, many=True)
                response_data['status'] = 1
                response_data['massage'] = 'Data found successfully'
                response_data['area'] = qs_data.data
            else:
                response_data['status'] = 0
                response_data['massage'] = 'Data not found'
                response_data['area'] = []
        else:
            response_data['status'] = 0
            response_data['massage'] = 'No Access'
        return Response(response_data, status=200)

    
    def post(self, request):
        user = request.user
        response_data = {}
        rs = User.objects.filter(id=user.id, is_superuser=True ,is_blocked=False, is_deleted=False)
        if rs:
            check_city = Area.objects.filter(area_name=request.data.get('area_name'), is_blocked=False, is_deleted=False)
            if not check_city:
                save_db={}
                save_db['state'] = request.data.get('state')
                save_db['city'] = request.data.get('city')
                save_db['created_by'] = user.id
                save_db['area_name'] = request.data.get('area_name')
                save_db['pin_code'] = request.data.get('pin_code')
                save_db['created_at'] = timezone.now()
                save_db['updated_at'] = timezone.now()
                serializer = AreaViewSerializer(data=save_db)
                if serializer.is_valid():
                    serializer.save()
                    response_data['status'] = 1
                    response_data['massage'] = 'Data found successfully'
                    response_data['area'] = serializer.data
                else:
                    response_data['status'] = 0
                    response_data['massage'] = 'Data not found'
                    response_data['area'] = []
            else:
                response_data['status'] = 1
                response_data['massage'] = 'City Already Added'
                response_data['area'] = []
        else:
            response_data['status'] = 0
            response_data['massage'] = 'No Access'
        return Response(response_data, status=200)
    
    def put(self, request):
        user = request.user
        response_data = {}
        requestData = request.data
        rs = User.objects.filter(id=user.id, is_superuser=True ,is_blocked=False, is_deleted=False)
        if rs:
            ars = Area.objects.filter(user_id=request.data.get('user_id') , id=request.data.get('area_id'))
            if ars:
                Area.objects.filter(id=requestData['area_id']).update(area_name=requestData['area_name'], pin_code=requestData['pin_code'],state=requestData['state'],city=requestData['city'], updated_at=timezone.now())
                response_data['status'] = 1
                response_data['massage'] = 'Area update successfully.'
                return Response(response_data, status=200)
            else:
                response_data['status'] = 0
                response_data['massage'] = 'Area update falure.'
                return Response(response_data, status=200)
        else:
            response_data['status'] = 0
            response_data['massage'] = 'No Access'
        return Response(response_data, status=200)







