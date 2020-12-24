from django.conf.urls import url, include
from django.conf.urls.static import static
from django.conf import settings
from rest_framework.authtoken import views as restview
from django.contrib.auth import views as auth_views
from bakerAdmin.webservice import vendor_Details_view ,admin_login_view , admin_city_state_view

##### User Management #####

urlpatterns = [
    #### Auth Admin Login   ####
    url(r'^admin-login/$', admin_login_view.AdminLoginView.as_view(), name='admin-login'),


    ### Approve Vendor ####
    url(r'^approve-vendor/$',admin_login_view.ApproveVendor.as_view(), name='approve-vendor'),

    #### Vendor Details  ####
    url(r'^vendor-details/$', vendor_Details_view.VendorDetailsView.as_view(), name='vendor-details'),
    url(r'^vendor-info/$', vendor_Details_view.VendorInfoView.as_view(), name='vendor-info'),

    url(r'^comment-reg/$', vendor_Details_view.CommentView.as_view(), name='comment-reg'),

    

    ### Create New State and City
    url(r'^add-area/$', admin_city_state_view.AddNewArea.as_view(), name='add-area'),
    url(r'^state-list/$', admin_city_state_view.StateListView.as_view(), name='state-list'),
    url(r'^city-list/$', admin_city_state_view.CityListView.as_view(), name='city-list'),
    url(r'^area-list/$', admin_city_state_view.AreaListView.as_view(), name='area-list'),
    url(r'^city-listById/$', admin_city_state_view.CityListViewById.as_view(), name='city-listById'),
    url(r'^area-listById/$', admin_city_state_view.AreaListViewById.as_view(), name='area-listById'),
    url(r'^pin-codeById/$', admin_city_state_view.PinCocdeViewById.as_view(), name='pin-codeById'),


]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)