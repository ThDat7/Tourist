from django.urls import path, include
from rest_framework import routers

from tours import views

router = routers.DefaultRouter()
# router.register('customers', views.CustomerViewSet, basename='customers')

urlpatterns = [
    path('', include(router.urls)),
    path('search/', views.SearchSuggestionView.as_view(), name='search'),
    path('search-tour/<int:id>/', views.TourSearchView.as_view(), name='tour-search'),
    path('search-tourist-place/<int:id>/', views.TouristPlaceSearchView.as_view(), name='tourist-place-search'),
    path('tour/<int:id>/', views.TourView.as_view(), name='tour-detail'),
    path('tour/<int:tour_id>/ratings/', views.TourRatingsView.as_view(), name='ratings'),
    path('tour/<int:tour_id>/pricing/', views.TourPricingView.as_view(), name='tour-pricing'),
    path('customers/<int:customer_id>/', views.CustomerView.as_view(), name='customer-info'),
    path('customers/<int:customer_id>/tours-history/', views.BookedTourView.as_view()),
    path('customers/rate-booking/<int:booking_id>/', views.RateBookingView.as_view()),
    path('order-booking/', views.OrderBookingView.as_view())
]
