from django.db.models import Avg
from rest_framework import serializers

from tours.models import Tour, TouristPlace, Rating


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


class TourSerializer(serializers.ModelSerializer):
    place_name = serializers.CharField(source='place.name')
    rating_count = serializers.IntegerField()
    avg_rating = serializers.FloatField()

    class Meta:
        model = Tour
        fields = '__all__'


class RatingSerializer(serializers.ModelSerializer):
    customer_info = serializers.SerializerMethodField()

    def get_customer_info(self, obj):
        return {
            'name': f'{obj.customer.user.last_name} {obj.customer.user.first_name}',
            # 'avatar': obj.customer.user.avatar,
        }

    class Meta:
        model = Rating
        fields = '__all__'


class TourPricingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tour
        fields = ['adult_price', 'child_price']
