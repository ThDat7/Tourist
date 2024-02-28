from django.db.models import Avg
from rest_framework import serializers

from tours.models import Tour, TouristPlace, Rating, ScheduleRecurringInWeek, ScheduleExcludeDate, \
    ScheduleRecurringWeekly, Customer, Booking, SavedTours, News, NewsComment


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
    main_image = serializers.SerializerMethodField()

    class Meta:
        model = Tour
        fields = ['id', 'name', 'main_image', 'place_name', 'adult_price', 'child_price', 'rating_count', 'avg_rating']

    def get_main_image(self, tour):
        if tour.main_image:
            request = self.context.get('request')
            return request.build_absolute_uri('/static/%s' % tour.main_image.name)


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
    description = serializers.SerializerMethodField()

    def get_image(self, obj):
        if obj.main_image:
            request = self.context.get('request')
            return request.build_absolute_uri('/static/%s' % obj.main_image.name)

    def get_description(self, obj):
        request = self.context.get('request')
        return obj.description.replace('src="/static',
                                       f'src="{request.build_absolute_uri('/static')}')

    class Meta:
        model = Tour
        fields = '__all__'


class RatingSerializer(serializers.ModelSerializer):
    customer_info = serializers.SerializerMethodField()

    def get_customer_info(self, obj):
        return {
            'name': f'{obj.booking.customer.user.last_name} {obj.booking.customer.user.first_name}',
            'avatar': {'uri': obj.booking.customer.user.avatar.url if obj.booking.customer.user.avatar else None},
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
    avatar = serializers.SerializerMethodField()
    phoneNumber = serializers.CharField(source='phone_number')

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user')
        user = instance.user
        user.last_name = user_data.get('last_name', user.last_name)
        user.first_name = user_data.get('first_name', user.first_name)
        user.email = user_data.get('email', user.email)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        user.save()
        instance.save()

        return instance

    def get_avatar(self, obj):
        if obj.user.avatar:
            if isinstance(obj.user.avatar, str):
                return {'uri': obj.user.avatar}
            else:
                return {'uri': obj.user.avatar.url}
        return None

    class Meta:
        model = Customer
        # fields = ['lastname', 'firstname', 'email', 'numberphone']
        fields = ['lastname', 'firstname', 'email', 'avatar', 'phoneNumber']


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
    main_image = serializers.SerializerMethodField()
    like_count = serializers.IntegerField(source='newslike_set.count')
    cmt_count = serializers.IntegerField(source='newscomment_set.count')

    class Meta:
        model = News
        fields = ['id', 'title', 'content', 'author_name', 'main_image', 'cmt_count', 'like_count']

    def get_main_image(self, obj):
        if obj.main_image:
            request = self.context.get('request')
            return request.build_absolute_uri('/static/%s' % obj.main_image.name)


class NewsDetailSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.name')
    content = serializers.SerializerMethodField()
    main_image = serializers.SerializerMethodField()
    is_like = serializers.SerializerMethodField()
    cmts = serializers.SerializerMethodField()

    class Meta:
        model = News
        fields = ['id', 'title', 'content', 'author_name', 'main_image', 'cmts', 'is_like']

    def get_main_image(self, obj):
        if obj.main_image:
            request = self.context.get('request')
            return request.build_absolute_uri('/static/%s' % obj.main_image.name)

    def get_content(self, obj):
        request = self.context.get('request')
        return obj.content.replace('src="/static', request.build_absolute_uri('/static'))

    def get_is_like(self, obj):
        request = self.context.get('request')
        if obj.newslike_set.filter(customer__user_id=request.user.id).exists():
            return True
        return False

    def get_cmts(self, obj):
        from django.db.models import Q
        comments = NewsComment.objects.filter(new_id=obj.id)
        return [{'cmt': comment.cmt, 'author': comment.customer.name} for comment in comments]
