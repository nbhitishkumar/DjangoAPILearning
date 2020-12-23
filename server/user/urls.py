from django.conf.urls import url, include
from django.conf.urls.static import static
from django.conf import settings
from rest_framework.authtoken import views as restview
from user.webservice import seller_signin_signup_view, mobile_otp_view, email_view, seller_profile_view
from django.contrib.auth import views as auth_views

##### User Management #####

urlpatterns = [
    ##### User Management #####
    url(r'^seller-login/$', seller_signin_signup_view.SellerUserLoginView.as_view(), name='seller-login'),
    url(r'^seller-registration/$', seller_signin_signup_view.SellerUserRegistrationView.as_view(), name='seller-registration'),
    url(r'vendor-loginOtp/',seller_signin_signup_view.SellerUserLoginOtpView.as_view(), name='vendor-loginOtp'),
    url(r'login-send-otp/',mobile_otp_view.SellerUserLoginOtpView.as_view(), name='login-send-otp'),
    url(r'^send-otp-login/',mobile_otp_view.LoginWithotpView.as_view(), name='send-otp-login'),
    url(r'^get-account/',seller_signin_signup_view.GetAccountView.as_view(), name='get-account'),

    #####  Update User Profile (Seller reg Info) ####
    url(r'^seller-info/$', seller_profile_view.SellerProfileView.as_view(),name='seller-info'),
    url(r'^upload/$',seller_profile_view.FileUploadView.as_view(),name='upload'),


    #### Get And Update Profile   ####
    url(r'^get-sellerProfile/$', seller_profile_view.SellerProfileUpdateView.as_view(),name='get-sellerProfile'),

    ### Email Notification ####
    url(r'^send-mail/$', mobile_otp_view.EmailDetailsView.as_view(),name='send-mail'),




    #### Check Mail ######
    url(r'^check-email/$',seller_signin_signup_view.CheckEmailView.as_view(),name='check-email'),
    url(r'^check-phone/$',seller_signin_signup_view.CheckPhoneView.as_view(),name='check-phone'),

    ##### Send and verify OTP #######
    url(r'^send-otp/$',mobile_otp_view.MobileDetailsView.as_view(),name='send-otp'),
    url(r'^check-otp/$',mobile_otp_view.OtpVerificationView.as_view(),name='check-otp'),

]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)