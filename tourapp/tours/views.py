from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from dj_rest_auth.views import LogoutView
from django.core.mail import send_mail
from django.db.models import Count, Avg
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from tours.models import Tour, TouristPlace, Rating, ScheduleRecurringWeekly, Customer, Booking, BookingStatus, Config, \
    ConfigKey
from tours.serializers import SearchSuggestionSerializer, TourSearchSerializer, TourSerializer, RatingSerializer, \
    TourPricingSerializer, TourScheduleSerializer, CustomerSerializer, BookingSerializer


# Create your views here.
class GoogleLoginView(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = 'http://127.0.0.1:8000/'
    client_class = OAuth2Client


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

    def get_permissions(self):
        return [permissions.IsAuthenticated()]


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
            rating_count=Count('booking__rating'),
            avg_rating=Avg('booking__rating__rate')
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
    def get(self, request, customer_id, format=None):
        customer = Customer.objects.filter(pk=customer_id).select_related('user').first()
        serializer = CustomerSerializer(customer)
        return Response(serializer.data)

    def put(self, request, user_id, format=None):
        customer = Customer.objects.filter(user_id=user_id).select_related('user').first()
        serializer = CustomerSerializer(customer, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


class BookedTourView(APIView):
    def get(self, request, customer_id, format=None):
        books = Booking.objects.filter(customer_id=customer_id)
        serializer = BookingSerializer(books, context={'request': request}, many=True)
        return Response(serializer.data)


class RateBookingView(APIView):
    def post(self, request, booking_id, format=None):
        cmt = request.data.get('comment', '')
        rate = request.data.get('rate', 0)

        customer_id = request.user.customer.id

        if (rate < 1 or rate > 5 or rate % 0.5 != 0):
            return Response({'error': 'Invalid rate'}, status=400)

        booking = Booking.objects.filter(pk=booking_id, customer_id=customer_id, status=BookingStatus.COMPLETED).first()
        if not booking:
            return Response({'error': 'Invalid booking'}, status=400)
        booking.rate.rate = rate
        booking.rate.cmt = cmt
        booking.rate.save()

        return Response('', status=201)


class OrderBookingView(APIView):
    def post(self, request, format=None):
        # nen su dung serializer
        tour_id = request.data.get('tour_id', 0)
        customer_id = request.user.customer.id
        adult_count = request.data.get('adult_count', 0)
        child_count = request.data.get('child_count', 0)
        time_start = request.data.get('time_start')

        tour = Tour.objects.filter(pk=tour_id).first()
        if not tour:
            return Response({'error': 'Invalid tour'}, status=400)

        booking = Booking(
            customer_id=customer_id,
            tour_id=tour_id,
            adult_count=adult_count,
            child_count=child_count,
            adult_price=tour.adult_price,
            child_price=tour.child_price,
            time_start=time_start,
            status=Booking.BookingStatus.UNPAID
        )
        booking.save()

        self.sendConfirmEmail(tour, request.user)

        return Response('', status=201)

    def sendConfirmEmail(self, booking):
        subject = (Config.objects.filter(key=ConfigKey.CONFIRM_EMAIL_SUBJECT)
                   .values_list('value', flat=True).first())
        message = (Config.objects.filter(key=ConfigKey.CONFIRM_EMAIL_MESSAGE)
                   .values_list('value', flat=True).first())

        message.replace('{tour_name}', booking.tour.name)
        message.replace('{customer_name}', booking.customer.name)
        message.replace('{adult_count}', booking.adult_count)
        message.replace('{child_count}', booking.child_count)
        message.replace('{time_order}', booking.time_order)
        message.replace('{total}',
                        booking.adult_count * booking.adult_price + booking.child_count * booking.child_price)

        send_mail(
            subject,
            message,
            "from@example.com",
            [booking.customer.user.email],
            fail_silently=False,
        )

    def get_permissions(self):
        return [permissions.IsAuthenticated()]

    def validate_start_time(self, tour, time_start):
        from datetime import datetime, timedelta

        days_in_week = tour.schedulerecurringweekly.schedulerecurringinweek_set
        excludes_day = tour.schedulerecurringweekly.scheduleexcludedate_set

        start_date = datetime.now()
        end_date = start_date + timedelta(days=90)

        d = start_date
        while d <= end_date:
            date_str = d.strftime('%Y-%m-%d')
            if date_str == time_start:
                if date_str not in excludes_day and (d.weekday() + 1) in days_in_week:
                    return True
                else:
                    return False
            d += timedelta(days=1)
        return False
