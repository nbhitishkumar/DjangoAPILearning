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
        rs = User.objects.filter(id=user_id,is_superuser=True, is_active=True, is_blocked=False, is_deleted=False)
        if rs:
            check_Category = SellerCategory.objects.filter(category_name=requestdata['category_name'],is_deleted=False).count()
            if check_Category > 0:
                response['status'] = 0
                response['msg'] = 'Category Already Added'
                http_status_code = 404
            else:
                obj = SellerCategory.objects.create(
                    user_id=user_id,
                    category_name = requestdata['category_name'],
                    category_des = requestdata['category_des'],
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
                    category_des = requestdata['category_des'],
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



class CategoryDetailsByidView(APIView):
    permission_classes = (IsAuthenticated,)
    def post(self,request):
        user = request.user
        user_id = user.id
        responce_data = {}
        requestData = request.data
        print(requestData)
        rs=SellerCategory.objects.filter(user_id=user_id, id=requestData['category_id'], is_deleted=False)
        print(rs)
        if rs:
            serializer = SellerCategorySerializer(rs, many=True)
            responce_data['status'] = 1
            responce_data['massage'] = 'category details'
            responce_data['category'] = serializer.data
            print(responce_data)
            return JsonResponse(responce_data, status=200)
        else:
            responce_data['status'] = 0
            responce_data['massage'] = 'This category is not present in our database'
            responce_data['category'] = []
            print(responce_data)
            return JsonResponse(responce_data, status=200)

class CategoryNameById(APIView):
    permission_classes = (IsAuthenticated,)
    def post(self,request):
        user = request.user
        user_id = user.id
        responce_data = {}
        requestData = request.data
        rs=User.objects.filter(id=user_id, is_deleted=False)
        if rs:
            categoryName = SellerCategory.objects.filter(id=requestData['category_id'])
            serializer = SellerCategoryNameSerializer(categoryName, many=True)
            responce_data['status'] = 1
            responce_data['massage'] = 'category details'
            responce_data['category'] = serializer.data
            return JsonResponse(responce_data, status=200)
        else:
            responce_data['status'] = 0
            responce_data['massage'] = 'This category is not present in our database'
            responce_data['category'] = []
            print(responce_data)
            return JsonResponse(responce_data, status=200)


class DeleteCategory(APIView):
    permission_classes = (IsAuthenticated,)
    def post(self,request):
        user = request.user
        user_id = user.id
        requestdata = request.data
        response = {}
        rs = User.objects.filter(id=user_id,is_superuser=True, is_active=True, is_blocked=False, is_deleted=False).first()
        if rs:
            check_category = SellerCategory.objects.filter(id=requestdata['category_id'], is_deleted=False)
            if check_category:
                obj = SellerCategory.objects.filter(id=requestdata['category_id']).update(
                    is_deleted=requestdata['is_deleted'],
                    modified_date=timezone.now(),
                )
                response['status'] = 1
                response['msg'] = 'Category Name Deleted'
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
        rs = User.objects.filter(id=user_id, user_type=2, is_active=True, is_blocked=False, is_deleted=False).first()
        if rs:
            if rs.is_shop_verified:
                category_data = SellerCategory.objects.filter(id=requestdata['category_id'], is_deleted=False)
                if category_data:
                    check_itemName = SellerItem.objects.filter(item_name=requestdata['item_name'],
                                                               is_deleted=False).count()
                    if check_itemName:
                        response_data['status'] = 0
                        response_data['msg'] = 'Item Already Added'
                        http_status_code = 404
                    else:
                        obj = SellerItem.objects.create(
                            user_id=user_id,
                            item_name=requestdata['item_name'],
                            item_price=requestdata['item_price'],
                            item_description=requestdata['item_description'],
                            item_preparing_time=requestdata['item_preparing_time'],
                            item_delivery_time=requestdata['item_delivery_time'],
                            category_id=requestdata['category_id'],
                        )
                        response_data['status'] = 1
                        response_data['msg'] = 'New Item Added'
                        http_status_code = 200
                else:
                    response_data['status'] = 0
                    response_data['msg'] = 'Category Not Found'
                    http_status_code = 404
            else:
                response_data['status'] = 0
                response_data['msg'] = 'Shop Not Verified'
                http_status_code = 404
        else:
            response_data['status'] = 0
            response_data['msg'] = 'User Not Found'
            http_status_code = 404
        return Response(response_data, status=http_status_code)



# def uploadFile(id, fileName, filetype, dir):
#     file1 = fileName
#     file_type = filetype
#     up_dir = dir
#     result_list = {}
#     new_file_name = ''
#     full_path_name = ''
#     upload_status = False
#     base64_image = ''
#     if file_type is None:
#         file_type = "img"
#     if up_dir is None:
#         up_dir = "images"
#     image_name = file1.name
#     name1 = get_random_string(length=8)
#     ext = image_name.split('.')[-1]
#     now = datetime.now().strftime('%Y%m%d-%H%M%S-%f')
#     uploaded_file_name = now + '.' + ext
#     #####################################
#     ## Check File Type (Only 'jpg', 'jpeg', 'gif', 'png','pdf' allowed)
#     if ext in ['jpg', 'jpeg', 'png']:
#         if not os.path.exists('media/' + str(up_dir) + '/'):
#             os.makedirs('media/' + str(up_dir) + '/')
#         upload_to = 'media/' + str(up_dir) + '/%s' % (uploaded_file_name)
#         fullpath = settings.BASE_DIR + '/media/' + str(up_dir)
#         destination = open(upload_to, 'wb+')
#         for chunk in file1.chunks():
#             destination.write(chunk)
#         destination.close()
#         if up_dir == 'item_image':
#             obj = SellerItem.objects.filter(id=id).update(
#             item_image=uploaded_file_name
#             )
#         if os.path.exists('media/' + str(up_dir) + '/'):
#             base64_image = encode_image_base64(settings.MEDIA_ROOT + '/'+str(up_dir)+'/' + uploaded_file_name)
#         data = {
#             'status': 1,
#             'base64_image': base64_image,
#             'uploaded_file_name': uploaded_file_name,
#             'uploaded_file_url': fullpath,
#             'message': 'Uploaded Successfully',
#         }
#         return data
#     else:
#         data = {
#             'status': 0,
#             'base64_image': base64_image,
#             'uploaded_file_name': '',
#             'uploaded_file_url': '',
#             'message': 'File extension error',
#         }
#         return data


def encode_image_base64(full_path):
    image = ''
    if full_path != "":
        with open(full_path, 'rb') as imgFile:
            image = base64.b64encode(imgFile.read())
    return image
    
    # def put(self, request)


#### admin works
class SellerItemListbyId(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, format=None):
        user = request.user
        user_id = user.id
        requestdata = request.data
        response_data = {}
        item_image_name = ''
        rs = User.objects.filter(id=user_id,is_deleted=False)
        if rs:
            item_list = SellerItem.objects.filter(category=requestdata['category_id'])
            item_serialize = SellerItemSerializer(item_list, many=True)
            for details in item_serialize.data:
                print()
            # for details in item_serialize.data:
            #     item_image_name = details['item_image']
            #     if item_image_name is not None:
            #         if os.path.exists('media/item_image/' + item_image_name):
            #             base64_image = encode_image_base64(settings.MEDIA_ROOT + '/item_image/' + item_image_name)
            #             details['item_image'] = base64_image
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







class ItemImageUpload(mixins.CreateModelMixin, generics.ListAPIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        user = request.user
        user_id = user.id
        file1 = request.FILES['file']  ## Uploaded file
        file_type = request.data['file_type']  ## file Type i.e. image / doc / pdf   etc
        up_dir = request.data['up_dir']
        result_list = {}
        new_file_name = ''
        full_path_name = ''
        upload_status = False
        base64_image = ''
        if file_type is None:
            file_type = "img"
        if up_dir is None:
            up_dir = "images"
        image_name = file1.name
        name1 = get_random_string(length=8)
        ext = image_name.split('.')[-1]
        now = datetime.now().strftime('%Y%m%d-%H%M%S-%f')
        uploaded_file_name = now + '.' + ext
        #####################################
        ## Check File Type (Only 'jpg', 'jpeg', 'gif', 'png','pdf' allowed)
        if ext in ['jpg', 'jpeg', 'gif', 'png', 'pdf']:
            if not os.path.exists('media/' + str(up_dir) + '/'):
                os.makedirs('media/' + str(up_dir) + '/')
            upload_to = 'media/' + str(up_dir) + '/%s' % (uploaded_file_name)
            fullpath = settings.BASE_DIR + '/media/' + str(up_dir)
            destination = open(upload_to, 'wb+')
            for chunk in file1.chunks():
                destination.write(chunk)
            destination.close()
            if up_dir == 'profile_image':
                obj = SellerItem.objects.filter(id=user_id).update(
                item_image=uploaded_file_name
                )
            elif up_dir == 'shop_image':
                obj = SellerCategory.objects.filter(id=user_id).update(
                category_image =uploaded_file_name
                )
            if os.path.exists('media/' + str(up_dir) + '/'):
                base64_image = encode_image_base64(settings.MEDIA_ROOT + '/'+str(up_dir)+'/' + uploaded_file_name)
            data = {
                'status': 1,
                'base64_image': base64_image,
                'uploaded_file_name': uploaded_file_name,
                'uploaded_file_url': fullpath,
                'message': 'Uploaded Successfully',
            }
        else:
            data = {
                'status': 0,
                'base64_image': base64_image,
                'uploaded_file_name': '',
                'uploaded_file_url': '',
                'message': 'File extension error',
            }

        return Response(data)

