from django.db.models import Count, Avg
from django.shortcuts import render
from rest_framework import viewsets, generics, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from tours.models import Tour, TouristPlace, Rating, ScheduleRecurringWeekly, Customer
from tours.serializers import SearchSuggestionSerializer, TourSearchSerializer, TourSerializer, RatingSerializer, \
    TourPricingSerializer, TourScheduleSerializer, CustomerSerializer


# Create your views here.
class SearchSuggestionView(APIView):
    def get(self, request, format=None):
        keyword = request.query_params.get('q', '')

        tours = Tour.objects.filter(name__icontains=keyword).select_related('place')
        tourist_places = TouristPlace.objects.filter(name__icontains=keyword)
        data = {
            'tours': tours,
            'tourist_places': tourist_places
        }
        serializer = SearchSuggestionSerializer(data)
        return Response(serializer.data)


class TourSearchView(APIView):
    def get(self, request, id, format=None):
        tour = Tour.objects.filter(pk=id).annotate(
            rating_count=Count('rating'),
            avg_rating=Avg('rating__rate')
        ).first()
        related_tours = Tour.objects.filter(place=tour.place).exclude(pk=id).annotate(
            rating_count=Count('rating'),
            avg_rating=Avg('rating__rate')
        )

        data = {
            'tours': TourSearchSerializer([tour], many=True).data,
            'related_tours': TourSearchSerializer(related_tours, many=True).data
        }

        return Response(data)


class TouristPlaceSearchView(APIView):
    def get(self, request, id, format=None):
        tours = Tour.objects.filter(place__id=id).annotate(
            rating_count=Count('rating'),
            avg_rating=Avg('rating__rate')
        )
        data = {
            'tours': TourSearchSerializer(tours, many=True).data
        }
        return Response(data)


class TourView(APIView):
    def get(self, request, id, format=None):
        tours = Tour.objects.filter(pk=id).annotate(
            rating_count=Count('rating'),
            avg_rating=Avg('rating__rate')
        ).first()

        serializer = TourSerializer(tours)
        return Response(serializer.data)


class TourRatingsView(APIView):
    def get(self, request, tour_id, format=None):
        ratings = Rating.objects.filter(tour_id=tour_id).select_related('customer__user')
        serializer = RatingSerializer(ratings, many=True)
        return Response(serializer.data)


class TourPricingView(APIView):
    def get(self, request, tour_id, format=None):
        tour = Tour.objects.filter(pk=tour_id).select_related('schedulerecurringweekly')
        serializer = TourPricingSerializer(tour)
        return Response(serializer.data)


class CustomerView(APIView):
    def get(self, request, user_id, format=None):
        customer = Customer.objects.filter(user_id=user_id).select_related('user').first()
        serializer = CustomerSerializer(customer)
        return Response(serializer.data)

    def put(self, request, user_id, format=None):
        customer = Customer.objects.filter(user_id=user_id).select_related('user').first()
        serializer = CustomerSerializer(customer, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
