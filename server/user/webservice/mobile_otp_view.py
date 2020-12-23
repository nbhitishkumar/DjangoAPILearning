from rest_framework.response import Response
from user.serializers import *
from rest_framework.views import APIView
import math, random
from twilio.rest import Client
import json
import requests
import smtplib,ssl

# account_sid = 'AC4206d6db4fe92e8f8033110f49f720de'
# auth_token = '45736e30fb44cab4c98551f48573635a'
# client = Client(account_sid, auth_token)
url = "https://www.fast2sms.com/dev/bulk"
#### FAST2SMS Gateway conf

port = 587
smtp_server ="smtp.gmail.com"
sender_email = "home.bakerkitchen@gmail.com"
password = "nitish12"


class MobileDetailsView(APIView):
    def post(self, request, *args, **kwargs):
        response_data = request.data
        mobile = request.data.get('mobile')
        response = {}
        rs = User.objects.filter(phone_no=mobile, is_blocked=False, is_deleted=False)
        if rs:
            for i in rs:
                user_id=i.id
            otp = generate_otp(mobile)
            message =sendsms(mobile,otp)
            if message:
                save_db={}
                save_db['created_date'] = timezone.now()
                save_db['mobile'] = mobile
                save_db['otp'] = otp
                save_db['user']=user_id
                save_db['modified_date'] = timezone.now()
                serializer = MobileViewSerializer(data=save_db)
                if serializer.is_valid():
                    user = OTP.objects.filter(user_id=user_id,is_deleted=False).first()
                    if not user:
                        serializer.save()
                        response['status'] = 1
                        response['msg'] = 'Otp Sent'
                        response['details'] = serializer.data
                        http_status_code = 200
                    else:
                        OTP.objects.filter(user_id=user_id).update(otp=otp)
                        response['status'] = 1
                        response['msg'] = 'Otp aleady sent check'
                        http_status_code = 200
                else:
                    response['status'] = 0
                    http_status_code = 404
            else:
                response['status'] = 0
                response['msg'] = 'Otp cannot be sent!!'
                http_status_code = 404

        else:
            response['status'] = 0
            response['msg'] = 'No user found'
            http_status_code = 404
        return Response(response, status=http_status_code)


class EmailDetailsView(APIView):
    def post(self, request, *args, **kwargs):
        response_data = request.data
        email = request.data.get('email')
        response = {}
        rs = User.objects.filter(email=email,is_blocked=False, is_deleted=False)
        if rs:
            for i in rs:
                user_id=i.id
            otp = generate_otp(email)
            message =send_mail_otp(otp,email)
            if message:
                save_db={}
                save_db['created_date'] = timezone.now()
                save_db['email'] = email
                save_db['otp'] = otp
                save_db['user']=user_id
                save_db['modified_date'] = timezone.now()
                serializer = EmailViewSerializer(data=save_db)
                if serializer.is_valid():
                    user = OTP.objects.filter(user_id=user_id,is_deleted=False).first()
                    if not user:
                        serializer.save()
                        response['status'] = 1
                        response['msg'] = 'Otp Sent'
                        response['details'] = serializer.data
                        http_status_code = 200
                    else:
                        OTP.objects.filter(user_id=user_id).update(otp=otp)
                        response['status'] = 1
                        response['msg'] = 'Otp aleady sent check'
                        http_status_code = 200
                else:
                    response['status'] = 0
                    http_status_code = 404
            else:
                response['status'] = 0
                response['msg'] = 'Otp cannot be sent!!'
                http_status_code = 404

        else:
            response['status'] = 0
            response['msg'] = 'No user found'
            http_status_code = 404
        return Response(response, status=http_status_code)



def send_mail_otp(otp,receiver_mail):
    s = smtplib.SMTP('smtp.gmail.com:587') 
    s.starttls() 
    s.login("home.bakerkitchen@gmail.com", "nitish12") 
    message = 'Subject: {}\n\n{}'.format('Home Baker kitchen email verification OTP',"Your Email Verification otp is:"+otp)
    s.sendmail("home.bakerkitchen@gmail.com", receiver_mail, message) 
    s.quit() 
    return True



#### Send Otp from Login With Otp Page
class LoginWithotpView(APIView):
    def post(self, request, *args, **kwargs):
        mobile = request.data.get('userPhone')
        response = {}
        rs = User.objects.filter(phone_no=mobile, is_active=True, is_blocked=False, is_deleted=False)
        if rs:
            for i in rs:
                user_id = i.id
            otp = generate_otp(mobile)
            message =sendsms(mobile,otp)
            if message:
                save_db = {}
                save_db['created_date'] = timezone.now()
                save_db['mobile'] = mobile
                save_db['otp'] = otp
                save_db['user'] = user_id
                save_db['modified_date'] = timezone.now()
                serializer = MobileViewSerializer(data=save_db)
                if serializer.is_valid():
                    user = OTP.objects.filter(user_id=user_id, is_deleted=False).first()
                    if not user:
                        serializer.save()
                        response['status'] = 1
                        response['msg'] = 'Otp Sent'
                        response['details'] = serializer.data
                        http_status_code = 200
                    else:
                        OTP.objects.filter(user_id=user_id).update(otp=otp)
                        response['status'] = 1
                        response['msg'] = 'OTP  sent check'
                        http_status_code = 200
                else:
                    response['status'] = 0
                    http_status_code = 404
            else:
                response['status'] = 0
                response['msg'] = 'Otp cannot be sent!!'
                http_status_code = 404
        else:
            response['status'] = 0
            response['msg'] = 'No user found'
            http_status_code = 404
        return Response(response, status=http_status_code)


class SellerUserLoginOtpView(APIView):
    def post(self, request, *args, **kwargs):
        response_data = request.data
        print(request.POST)
        mobile = request.data.get('mobile')
        response = {}
        rs = User.objects.filter(phone_no=mobile, is_active=True, is_blocked=False, is_deleted=False)
        for i in rs:
            user_id= rs.id
        if rs:
            otp = generate_otp(mobile)
            message =sendsms(mobile,otp)
            if message:
                save_db={}
                save_db['created_date'] = timezone.now()
                save_db['mobile'] = mobile
                save_db['otp'] = otp
                save_db['user']=user_id
                save_db['modified_date'] = timezone.now()
                serializer = MobileViewSerializer(data=save_db)
                if serializer.is_valid():
                    user = OTP.objects.filter(user_id=user_id,is_deleted=False).first()
                    if not user:
                        serializer.save()
                        response['status'] = 1
                        response['msg'] = 'Otp Sent'
                        response['details'] = serializer.data
                        http_status_code = 200
                    else:
                        OTP.objects.filter(user_id=user_id).update(otp=otp)
                        response['status'] = 1
                        response['msg'] = 'Otp already sent check'
                        http_status_code = 200
                else:
                    response['status'] = 0
                    http_status_code = 404
            else:
                response['status'] = 0
                response['msg'] = 'Otp cannot be sent!!'
                http_status_code = 404

        else:
            response['status'] = 0
            response['msg'] = 'No user found'
            http_status_code = 404
        return Response(response, status=http_status_code)

def sendsms(number, msg):
    payload = {
        'sender_id': 'FSTSMS',
        'message': "Your Otp for Registration is "+str(msg),
        'language': 'english',
        'route': 'p',
        'numbers': number
    }
    headers = { 
    'authorization': "BzXnK9CU1tlvORuNTisedZ6krW3QEPM2HFg4Y5ocwSm0hbxVAL5QxlHSrWfLa6KwM9Iu8tRUZB04nOED", 
    'Content-Type': "application/x-www-form-urlencoded", 
    'Cache-Control': "no-cache"
}
    response = requests.request("POST", url, data=payload, headers=headers)
    print(response.text)
    return response.text

def generate_otp(mobile):
    if mobile:
        digits = '0123456789'
        new_otp = ''
        for i in range(4):
            new_otp += digits[math.floor(random.random() * 10)]
        return new_otp
    else:
        return False



class OtpVerificationView(APIView):
    def post(self, request, *args, **kwargs):
        response_data = request.data
        otp = request.data.get('otp')
        phone_no = request.data.get('phone_no')
        user_id = User.objects.filter(phone_no=phone_no).values('id').distinct()
        user_id = user_id[0]['id']
        rs=OTP.objects.filter(user_id=user_id).values('otp','modified_date').distinct()
        generated_otp = rs[0]['otp']
        response = {}
        validity = timezone.now() - rs[0]['modified_date']
        rs = User.objects.filter(id=user_id, is_active=True, is_blocked=False, is_deleted=False)
        if rs:
            if otp == generated_otp:
                user_access = User.objects.filter(phone_no=phone_no).values('account').distinct()
                user_update = Users.objects.filter(id=user_id).update(is_phone_verified=True)
                otp_update = OTP.objects.filter(user_id=user_id).update(is_verified=int(True))
                response['status'] = 1
                response['msg'] = 'Otp Verified'
                response['p']= user_access[0]['account']
                http_status_code = 200
            else:
                user_update = Users.objects.filter(id=user_id).update(is_phone_verified=False)
                otp_update = OTP.objects.filter(user_id=user_id).update(is_verified=int(False))
                response['status'] = 0
                response['msg'] = 'Incorrect Otp'
                http_status_code = 200
        else:
            response['status'] = 0
            response['msg'] = 'No user found'
            http_status_code = 404
        return Response(response, status=http_status_code)