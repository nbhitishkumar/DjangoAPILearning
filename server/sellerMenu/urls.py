from django.conf.urls import url, include
from django.conf.urls.static import static
from django.conf import settings
from rest_framework.authtoken import views as restview
from django.contrib.auth import views as auth_views
from sellerMenu.webservice import seller_menu_view

##### User Management #####

urlpatterns = [
    ##### Category Management #####
    url(r'^seller-category/$', seller_menu_view.SellerCategoryMenuView.as_view(), name='seller-category'),
    url(r'^seller-categoryByid/$', seller_menu_view.CategoryDetailsByidView.as_view(), name='seller-categoryByid'),
    url(r'^delete-categoryByid/$', seller_menu_view.DeleteCategory.as_view(), name='delete-categoryByid'),



    # #### Item Management   #####
    # url(r'^seller-itemlist/$', seller_menu_view.SellerItemList.as_view(), name='seller-itemlist'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)