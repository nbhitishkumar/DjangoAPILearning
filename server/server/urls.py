from django.contrib import admin
from django.urls import path
from django.conf.urls import url, include
from user import *
from rest_framework_simplejwt import views as jwt_views
from bakerAdmin import *
from sellerMenu import *
from common import *

urlpatterns = [
    #path('admin/', admin.site.urls),
    path('api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    url(r'^api/user/', include('user.urls')),
    url(r'^api/backerAdmin/',include('bakerAdmin.urls')),
    url(r'^api/dynamicMenu/',include('sellerMenu.urls')),
    url(r'^api/common/',include('common.urls')),
]
