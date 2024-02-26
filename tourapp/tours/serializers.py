from django.db.models import Avg
from rest_framework import serializers

from tours.models import Tour, TouristPlace, Rating, ScheduleRecurringInWeek, ScheduleExcludeDate, \
    ScheduleRecurringWeekly, Customer, Booking, SavedTours, News


class TourSearchSuggestionSerializer(serializers.ModelSerializer):
    place_name = serializers.CharField(source='place.name')

    class Meta:
        model = Tour
        fields = ['id', 'name', 'place_name']


class TouristPlaceSearchSuggestionSerializer(serializers.ModelSerializer):
    number_of_tours = serializers.IntegerField(source='tour_set.count')

    class Meta:
        model = TouristPlace
        fields = ['id', 'name', 'number_of_tours']


class SearchSuggestionSerializer(serializers.Serializer):
    tours = TourSearchSuggestionSerializer(many=True)
    tourist_places = TouristPlaceSearchSuggestionSerializer(many=True)


class TourSearchSerializer(serializers.ModelSerializer):
    place_name = serializers.CharField(source='place.name')
    rating_count = serializers.IntegerField()
    avg_rating = serializers.FloatField()

    class Meta:
        model = Tour
        fields = ['id', 'name', 'main_image', 'place_name', 'adult_price', 'child_price', 'rating_count', 'avg_rating']


class TourScheduleSerializer(serializers.ModelSerializer):
    days_in_week = serializers.SerializerMethodField()
    excludes_day = serializers.SerializerMethodField()

    def get_days_in_week(self, obj):
        return [day.day_in_week for day in obj.schedulerecurringinweek_set.all()]

    def get_excludes_day(self, obj):
        return [day.date for day in obj.scheduleexcludedate_set.all()]

    class Meta:
        model = ScheduleRecurringWeekly
        fields = ['starting_date', 'time', 'days_in_week', 'excludes_day']


class TourSerializer(serializers.ModelSerializer):
    place_name = serializers.CharField(source='place.name')
    rating_count = serializers.IntegerField()
    avg_rating = serializers.FloatField()
    schedule = TourScheduleSerializer(source='schedulerecurringweekly')
    image = serializers.SerializerMethodField()

    def get_image(self, obj):
        if obj.main_image:
            request = self.context.get('request')
            return request.build_absolute_uri('/static/%s' % obj.main_image.name)

    class Meta:
        model = Tour
        fields = '__all__'


class RatingSerializer(serializers.ModelSerializer):
    customer_info = serializers.SerializerMethodField()

    def get_customer_info(self, obj):
        return {
            'name': f'{obj.booking.customer.user.last_name} {obj.booking.customer.user.first_name}',
            # 'avatar': obj.customer.user.avatar,
        }

    class Meta:
        model = Rating
        fields = '__all__'


class TourPricingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tour
        fields = ['adult_price', 'child_price']


class CustomerSerializer(serializers.ModelSerializer):
    lastname = serializers.CharField(source='user.last_name')
    firstname = serializers.CharField(source='user.first_name')
    email = serializers.CharField(source='user.email')

    # numberphone = serializers.CharField(source='user.phone')

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user')
        user = instance.user
        print(user_data)
        user.last_name = user_data.get('last_name', user.last_name)
        user.first_name = user_data.get('first_name', user.first_name)
        user.email = user_data.get('email', user.email)
        user.save()

        return instance

    class Meta:
        model = Customer
        # fields = ['lastname', 'firstname', 'email', 'numberphone']
        fields = ['lastname', 'firstname', 'email']


class BookingSerializer(serializers.ModelSerializer):
    tour_name = serializers.CharField(source='tour.name')
    tour_price = serializers.FloatField(source='tour.adult_price')
    tour_main_image = serializers.SerializerMethodField()
    total = serializers.SerializerMethodField()

    def get_total(self, booking):
        return booking.adult_count * booking.tour.adult_price + booking.child_count * booking.tour.child_price

    def get_tour_main_image(self, booking):
        if booking.tour.main_image:
            request = self.context.get('request')
            return request.build_absolute_uri('/static/%s' % booking.tour.main_image.name)

    class Meta:
        model = Booking
        fields = '__all__'


class SavedToursSerializer(serializers.ModelSerializer):
    tour = TourSearchSerializer()

    class Meta:
        model = SavedTours
        fields = ['tour']


class NewsSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.name')

    class Meta:
        model = News
        fields = ['title', 'content', 'author_name']
