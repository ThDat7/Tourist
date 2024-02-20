from django.core.management.base import BaseCommand
from django.apps import apps
from faker import Faker
from tours.models import TouristPlace, Tag, Tour, Booking, Customer, BookingStatus, User
import random

class Command(BaseCommand):
    help = 'Generate random data for all models'

    def handle(self, *args, **kwargs):
        fake = Faker()

        def create_tourist_places(num_places=10):
            for _ in range(num_places):
                TouristPlace.objects.create(name=fake.city())

        # Tạo dữ liệu giả cho Tag
        def create_tags(num_tags=10):
            for _ in range(num_tags):
                Tag.objects.create(name=fake.word())

        # Tạo dữ liệu giả cho Tour
        def create_tours(num_tours=20):
            places = TouristPlace.objects.all()
            tags = Tag.objects.all()
            staff_users = User.objects.filter(is_staff=True)
            for _ in range(num_tours):
                place = random.choice(places)
                author = random.choice(staff_users.staff)
                tour = Tour.objects.create(
                    name=fake.company(),
                    description=fake.text(),
                    place=place,
                    adult_price=random.randint(100, 500),
                    child_price=random.randint(50, 250),
                    author=author
                )
                tour.tags.set(random.choices(tags, k=random.randint(1, 3)))

        # Tạo dữ liệu giả cho Booking
        def create_bookings(num_bookings=50):
            customers = Customer.objects.all()
            tours = Tour.objects.all()
            for _ in range(num_bookings):
                customer = random.choice(customers)
                tour = random.choice(tours)
                Booking.objects.create(
                    customer=customer,
                    tour=tour,
                    adult_price=tour.adult_price,
                    child_price=tour.child_price,
                    status=random.choice([status[0] for status in BookingStatus.choices])
                )

        create_tourist_places()
        create_tags()
        create_tours()
        create_bookings()