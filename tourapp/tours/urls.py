from django.urls import path

from tours.views import SearchSuggestionView, TourSearchView, TouristPlaceSearchView, TourView, TourRatingsView, \
    TourPricingView

urlpatterns = [
    path('search/', SearchSuggestionView.as_view(), name='search'),
    path('search-tour/<int:id>/', TourSearchView.as_view(), name='tour-search'),
    path('search-tourist-place/<int:id>/', TouristPlaceSearchView.as_view(), name='tourist-place-search'),
    path('tour/<int:id>/', TourView.as_view(), name='tour-detail'),
    path('tour/<int:tour_id>/ratings/', TourRatingsView.as_view(), name='ratings'),
    path('tour/<int:tour_id>/pricing/', TourPricingView.as_view(), name='tour-pricing')
]