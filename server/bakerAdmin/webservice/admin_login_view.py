from rest_framework import generics
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from django.http import JsonResponse
from django.http import HttpResponse
from bakerAdmin.serializers import *
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
import base64
from django.contrib.auth import get_user_model


class JSONResponse(HttpResponse):
    """ An HttpResponse that renders its content into JSON. """

    def __init__(self, data, **kwargs):
        content = JSONRenderer().render(data)
        kwargs['content_type'] = 'application/json'
        super(JSONResponse, self).__init__(content, **kwargs)


class AdminLoginView(generics.ListAPIView):
    def post(self, request):
        serializer = AdminLoginSerializer(data=request.data)
        if serializer.is_valid():
            requestData = serializer.validated_data
            email = requestData['email']
            password = requestData['password']
            User = get_user_model()
            try:  ## Check user Number Exist
                user = User.objects.filter(email=email, is_superuser=True, is_deleted=False, is_blocked=False).first()
                if user:
                    if user.check_password(password):  ## Check password matched or not
                        if user.is_phone_verified:  ## Check user phone is verified or not
                            if user.is_active:  ## Check user active or deactive
                                token, created = Token.objects.get_or_create(
                                    user=user)  ### Get user authentication token
                                token_data = token.key  ### if it is first login then create token first and get token
                                user.last_login = timezone.now()
                                user.save()
                                serialize_userdata = {
                                    'status': 1,
                                    'id': user.id,
                                    'email': user.email,
                                    'phone_no':user.phone_no,
                                    'username': user.username,
                                    'token': token_data,
                                    'first_name': user.first_name,
                                    'last_name': user.last_name,
                                    'is_superuser': user.is_superuser,
                                    'is_active': user.is_active,
                                    'is_staff': user.is_staff,
                                    'last_login': user.last_login
                                }
                                return JSONResponse(serialize_userdata, status=200)
                            else:
                                return JSONResponse({'status': 0, 'msg': 'Your account is not acivated.'}, status=200)
                        else:
                            return JsonResponse({'status': 0, 'msg': 'Your Mobile Number is not verified'}, status=200)
                    else:
                        return JsonResponse({'status': 0, 'msg': 'Password did not match'}, status=200)
                else:
                    return JsonResponse({'status': 0, 'msg': 'Mobile Number did not match or No Access'}, status=200)
            except User.DoesNotExist:
                return JSONResponse({'status': 0, 'msg': 'Authentication Error'}, status=401)
        else:
            return JsonResponse({'msg': 'Mobile Or Password did not match'}, status=401)



class CheckEmailView(generics.ListAPIView):
    lookup_field = 'pk'

    def post(self, request, *args, **kwargs):
        email = request.data['email']
        UserProfile = get_user_model()
        rs = UserProfile.objects.all().filter(email=email, is_deleted="False").first()
        # count = len(rs)
        if rs:
            msg = "Email Already linked with another user"
            data = {
                'status': 1,
                'error_type': 'email_exist',
                'message': msg
            }
            return Response(data)
        else:
            data = {
                'status': 0,
                'error_type': '',
                'message': 'Email Does not Exist',
            }
            return Response(data)


class CheckPhoneView(generics.ListAPIView):
    lookup_field = 'pk'

    def post(self, request, *args, **kwargs):
        phone_no = request.data['phone_no']
        UserProfile = get_user_model()
        count = UserProfile.objects.all().filter(phone_no=phone_no, is_deleted="False").count()
        if count > 0:
            data = {
                'status': 1,
                'error_type': 'phoneno_exist',
                'message': 'Number is Already Linked Try Different!!',
            }
            return Response(data)
        else:
            data = {
                'status': 0,
                'error_type': '',
                'message': 'Phone No Does not Exist',
            }
            return Response(data)


class ApproveVendor(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)

    def put(self, request):
        user = request.user
        response_data = {}
        requestData = request.data
        rs = User.objects.filter(id=user.id, is_superuser=True ,is_blocked=False, is_deleted=False)
        if rs:
            approve = User.objects.filter(id=requestData['user_id'],user_type=2).update(is_shop_verified=requestData['is_shop_verified'],modified_date=timezone.now())
            response_data['status'] = 1
            response_data['message'] = 'Account Updated'
            return JsonResponse(response_data, status=200)
        else:
            response_data['status'] = 0
            response_data['message'] = 'No Access'
            return JsonResponse(response_data, status=200)


def account_encoder(account):
    account_string_bytes = account.encode("ascii")
    base64_bytes = base64.b64encode(account_string_bytes)
    base64_string = base64_bytes.decode("ascii")
    return  base64_string

def account_decoder(account):
    account_string_bytes = account.encode("ascii")
    base64_bytes = base64.b64decode(account_string_bytes)
    base64_string = base64_bytes.decode("ascii")
    return base64_string