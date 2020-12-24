from django.utils.crypto import get_random_string
from rest_framework import generics, permissions, status, views, mixins
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from user.serializers import *
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from sellerMenu.models import *
import django.db.models
from django.core.mail import send_mail
import random
from django.utils import timezone
import os


class SellerProfileView(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)

    #### Get All Profile Information
    def get(self, request, format=None):
        user = request.user
        user_id = user.id
        response_data = {}
        profile_image_name = ''
        shop_image_name = ''
        aadhaar_front_image_name = ''
        aadhaar_back_image_name = ''
        owner_image_name = ''
        gstin_image_name = ''
        fssal_image_name = ''
        rs = User.objects.filter(id=user_id, is_active=True, is_blocked=False, is_deleted=False)
        if rs:
            user_serialize = SellerProfileSerializer(rs, many=True)
            for details in user_serialize.data:
                profile_image_name = details['profile_image']
                shop_image_name = details['shop_image']
                aadhaar_front_image_name = details['aadhaar_front_image']
                aadhaar_back_image_name = details['aadhaar_back_image']
                owner_image_name = details['owner_image']
                gstin_image_name = details['gstin_image']
                fssai_image_name = details['fssai_image']
                if profile_image_name is not None:
                    if os.path.exists('media/profile_image/' + profile_image_name):
                        base64_image = encode_image_base64(settings.MEDIA_ROOT + '/profile_image/' + profile_image_name)
                        details['profile_image'] = base64_image
                if shop_image_name is not None:
                    if os.path.exists('media/shop_image/' + shop_image_name):
                        base64_image = encode_image_base64(settings.MEDIA_ROOT + '/shop_image/' + shop_image_name)
                        details['shop_image'] = base64_image
                if owner_image_name is not None:
                    if os.path.exists('media/owner_image/' + owner_image_name):
                        base64_image = encode_image_base64(settings.MEDIA_ROOT + '/owner_image/' + owner_image_name)
                        details['owner_image'] = base64_image
                if aadhaar_front_image_name is not None:
                    if os.path.exists('media/aadhaar_front_image/' + aadhaar_front_image_name):
                        base64_image = encode_image_base64(settings.MEDIA_ROOT + '/aadhaar_front_image/' + aadhaar_front_image_name)
                        details['aadhaar_front_image'] = base64_image
                if aadhaar_back_image_name is not None:
                    if os.path.exists('media/aadhaar_back_image/' + aadhaar_back_image_name):
                        base64_image = encode_image_base64(settings.MEDIA_ROOT + '/aadhaar_back_image/' + aadhaar_back_image_name)
                        details['aadhaar_back_image'] = base64_image
                if gstin_image_name is not None:
                    if os.path.exists('media/gstin_image/' + gstin_image_name):
                        base64_image = encode_image_base64(settings.MEDIA_ROOT + '/gstin_image/' + gstin_image_name)
                        details['gstin_image'] = base64_image
                if fssai_image_name is not None:
                    if os.path.exists('media/fssai_image/' + fssai_image_name):
                        base64_image = encode_image_base64(settings.MEDIA_ROOT + '/fssai_image/' + fssai_image_name)
                        details['fssai_image'] = base64_image
            response_data['status'] = 1
            response_data['msg'] = 'Successfully get seller details'
            response_data['profile_details'] = user_serialize.data
            http_status_code = 200
        else:
            response_data['status'] = 0
            response_data['msg'] = 'No data found'
            response_data['profile_details'] = []
            http_status_code = 404
        return Response(response_data, status=http_status_code)

    def put(self, request, format=None):
        response_data = {}
        user = request.user
        user_id = user.id
        requestdata = request.data
        ## Check user is exist or not
        rs = User.objects.filter(id=user_id, is_active=True, is_blocked=False, is_deleted=False).first()
        if rs:
            obj = User.objects.filter(id=user_id).update(
                address = requestdata['address'],
                pin_code=requestdata['pin_code'],
                latitude=requestdata['latitude'],
                longitude=requestdata['longitude'],
                owner_name=requestdata['owner_name'],
                shop_name=requestdata['shop_name'],
                gstin_present=requestdata['gstin_present'],
                gstin_number=requestdata['gstin_number'],
                registration_date=requestdata['registration_date'],
                gst_state=requestdata['gst_state'],
                gst_type=requestdata['gst_type'],
                fssai_number= requestdata['fssai_number'],
                fssai_reg_name= requestdata['fssai_reg_name'],
                fssai_exp_date=requestdata['fssai_exp_date'],
                fssai_address =requestdata['fssai_address'],
                shop_city = requestdata['shop_city'],
                shop_landmark =requestdata['shop_landmark'],
                modified_date=timezone.now(),
                floor_no = requestdata['floor_no'],
                mall_name = requestdata['mall_name'],
                shop_area = requestdata['shop_area'],
                state= requestdata['state']
            )
            response_data['status'] = 1
            response_data['massage'] = "User update successfuly"
            response_data['user_id'] = user_id
            return Response(response_data, status=200)
        else:
            response_data['status'] = 0
            response_data['massage'] = "User not found"
            response_data['user_id'] = user_id
            return Response(response_data, status=200)


class SellerProfileUpdateView(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request, format=None):
        user = request.user
        user_id = user.id
        response_data = {}
        rs = User.objects.filter(id=user_id, is_active=True, is_blocked=False, is_deleted=False)
        if rs:
            user_serialize = SellerProfileSerializer(rs, many=True)
            response_data['status'] = 1
            response_data['msg'] = 'Successfully get seller details'
            response_data['profile_details'] = user_serialize.data
            http_status_code = 200
        else:
            response_data['status'] = 0
            response_data['msg'] = 'No data found'
            response_data['profile_details'] = []
            http_status_code = 404
        return Response(response_data, status=http_status_code)

    def put(self, request):
        user = request.user
        user_id = user.id
        response_data = {}
        rs = User.objects.filter(id=user_id, is_active=True, is_blocked=False, is_deleted=False)
        if rs:
            updateData= User.objects.filter(id=user_id).update(first_name=request.data['first_name'],last_name=request.data['last_name'],address=request.data['address'])
            response_data['status'] = 1
            response_data['msg'] = 'Successfully update Profile'
            http_status_code = 200
        else:
            response_data['status'] = 0
            response_data['msg'] = 'No User found'
            response_data['profile_details'] = []
            http_status_code = 404
        return Response(response_data, status=http_status_code)





class FileUploadView(mixins.CreateModelMixin, generics.ListAPIView):
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
                obj = User.objects.filter(id=user_id).update(
                profile_image=uploaded_file_name
                )
            elif up_dir == 'shop_image':
                obj = User.objects.filter(id=user_id).update(
                shop_image =uploaded_file_name
                )
            elif up_dir == 'owner_image':
                obj = User.objects.filter(id=user_id).update(
                owner_image =uploaded_file_name
                )
            elif up_dir == 'aadhaar_back_image':
                obj = User.objects.filter(id=user_id).update(
                aadhaar_back_image =uploaded_file_name
                )
            elif up_dir == 'aadhaar_front_image':
                obj = User.objects.filter(id=user_id).update(
                aadhaar_front_image =uploaded_file_name
                )
            elif up_dir == 'gstin_image':
                obj = User.objects.filter(id=user_id).update(
                gstin_image =uploaded_file_name
                )
            elif up_dir == 'fssai_image':
                obj = User.objects.filter(id=user_id).update(
                fssai_image =uploaded_file_name
                )
            elif up_dir == 'category_image':
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


def encode_image_base64(full_path):
    image = ''
    if full_path != "":
        with open(full_path, 'rb') as imgFile:
            image = base64.b64encode(imgFile.read())
    return image
