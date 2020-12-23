from django.conf.urls import url, include
from django.conf.urls.static import static
from django.conf import settings
from rest_framework.authtoken import views as restview
from django.contrib.auth import views as auth_views

##### User Management #####

urlpatterns = [
    ##### Comment Box #####
    



    # #### Item Management   #####
    # url(r'^seller-itemlist/$', seller_menu_view.SellerItemList.as_view(), name='seller-itemlist'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)