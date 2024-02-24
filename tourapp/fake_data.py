import random

from django.core.files.images import ImageFile
from faker import Faker

# python manage.py flush --noinput

fake = Faker()

if __name__ == '__main__':
    import os

    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "tourapp.settings")
    import django

    django.setup()
    from django.core.management import call_command

    from django.contrib.auth.hashers import make_password
    from tours.models import Customer, Staff, Tag, TouristPlace, Tour, ScheduleRecurringWeekly, \
        ScheduleRecurringInWeek, ScheduleExcludeDate, BookingStatus, Booking, Rating, TourComment, News, NewsComment, \
        NewsLike, Config, ConfigKey, User, Admin, SavedTours
    from allauth.socialaccount.models import SocialApp
    import requests
    from io import BytesIO
    from PIL import Image


    def create_oauth_google_config():
        client_id = '445922909728-oef43d5c2j5851902dl89ih74cec3hgt.apps.googleusercontent.com'
        secret = "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"
        SocialApp.objects.create(provider='google', name='Google',
                                 client_id=client_id,
                                 secret=secret)


    def create_users(num_users=20):
        for _ in range(num_users):
            username = fake.user_name()
            email = fake.email()
            password = make_password(fake.password())
            avatar_url = fake.image_url()
            user = User.objects.create(username=username, email=email, password=password, avatar=avatar_url)
            print(f"Created User: {user.username}, Password: {fake.password()}")


    def create_admins(num_admins=1):
        for _ in range(num_admins):
            username = 'admin'
            email = fake.email()
            password = make_password('123')
            avatar_url = fake.image_url()
            admin_user = User.objects.create(username=username, email=email, password=password, avatar=avatar_url,
                                             is_staff=True, is_superuser=True)
            Admin.objects.create(user=admin_user)
            print(f"Created Admin: {admin_user.username}, Password: {fake.password()}")


    def create_staff(num_staff=5):
        for _ in range(num_staff):
            username = fake.user_name()
            email = fake.email()
            password = make_password(fake.password())
            avatar_url = fake.image_url()
            staff_user = User.objects.create(username=username, email=email, password=password, avatar=avatar_url,
                                             is_staff=True)
            Staff.objects.create(user=staff_user)
            print(f"Created Staff: {staff_user.username}, Password: {fake.password()}")


    def create_customers(num_customers=20):
        for _ in range(num_customers):
            username = fake.user_name()
            email = fake.email()
            password = make_password(fake.password())
            avatar_url = fake.image_url()
            customer_user = User.objects.create(username=username, email=email, password=password, avatar=avatar_url)
            Customer.objects.create(user=customer_user)
            print(f"Created Customer: {customer_user.username}, Password: {fake.password()}")


    def create_tourist_places(num_places=10):
        for _ in range(num_places):
            place = TouristPlace.objects.create(name=fake.city())
            print(f"Created Tourist Place: {place.name}")


    def create_tags(num_tags=10):
        for _ in range(num_tags):
            tag = Tag.objects.create(name=fake.word())
            print(f"Created Tag: {tag.name}")


    def create_tours(num_tours=20):
        places = TouristPlace.objects.all()
        tags = Tag.objects.all()
        staff_users = Staff.objects.all()

        if not staff_users.exists():
            print("No staff users found.")
            return

        for _ in range(num_tours):
            place = random.choice(places)
            tour_author = random.choice(staff_users)

            # 1111111.jpg

            tour = Tour.objects.create(
                name=fake.company(),
                description=fake.text(),
                place=place,
                adult_price=random.randint(100, 500),
                child_price=random.randint(50, 250),
                author=tour_author
            )


    def create_saved_tours(num_saved_tours=50):
        customers = Customer.objects.all()
        tours = Tour.objects.all()
        for _ in range(num_saved_tours):
            customer = random.choice(customers)
            tour = random.choice(tours)
            SavedTours.objects.create(customer=customer, tour=tour)
            print(f"Saved Tour for Customer: {customer.user.username}")


    def create_schedule_recurring_weekly(num_schedules=5):
        tours = Tour.objects.all()
        for tour in tours:
            if not ScheduleRecurringWeekly.objects.filter(tour=tour).exists():
                starting_date = fake.date_time_this_year()
                time = fake.time()
                ScheduleRecurringWeekly.objects.create(tour=tour, starting_date=starting_date, time=time)
                print(f"Created ScheduleRecurringWeekly for Tour: {tour.name}")


    def create_schedule_recurring_in_week(num_schedules=5):
        weekly_schedules = ScheduleRecurringWeekly.objects.all()
        for _ in range(num_schedules):
            weekly_schedule = random.choice(weekly_schedules)
            ScheduleRecurringInWeek.objects.create(schedule=weekly_schedule, day_in_week=random.randint(1, 7))
            print(f"Created ScheduleRecurringInWeek for Tour: {weekly_schedule.tour.name}")


    def create_schedule_exclude_dates(num_dates=5):
        weekly_schedules = ScheduleRecurringWeekly.objects.all()
        for _ in range(num_dates):
            weekly_schedule = random.choice(weekly_schedules)
            date = fake.date()
            ScheduleExcludeDate.objects.create(recurring=weekly_schedule, date=date)
            print(f"Created ScheduleExcludeDate for Tour: {weekly_schedule.tour.name}")


    def create_bookings(num_bookings=50):
        customers = Customer.objects.all()

        if not customers.exists():
            print("No customers found.")
            return

        tours = Tour.objects.all()
        for _ in range(num_bookings):
            customer = random.choice(customers)
            tour = random.choice(tours)
            time_start = fake.date_time_this_year()  # Tạo ngẫu nhiên một thời điểm trong năm nay
            adult_count = random.randint(1, 4)  # Tạo số lượng người lớn ngẫu nhiên từ 1 đến 4
            child_count = random.randint(0, 3)  # Tạo số lượng trẻ em ngẫu nhiên từ 0 đến 3
            booking = Booking.objects.create(
                customer=customer,
                tour=tour,
                time_start=time_start,  # Cung cấp giá trị cho trường time_start
                adult_price=tour.adult_price,
                child_price=tour.child_price,
                adult_count=adult_count,  # Cung cấp giá trị cho trường adult_count
                child_count=child_count,  # Cung cấp giá trị cho trường child_count
                status=random.choice([status[0] for status in BookingStatus.choices])
            )
            print(f"Created Booking: {booking.id}")


    def create_ratings(num_ratings=50):
        customers = Customer.objects.all()
        bookings = Booking.objects.all()

        if not customers.exists():
            print("No customers found.")
            return

        if not bookings.exists():
            print("No bookings found.")
            return

        for _ in range(num_ratings):
            customer = random.choice(customers)
            booking = random.choice(bookings)

            # Kiểm tra xem đã có bản ghi Rating với booking_id tương tự chưa
            existing_rating = Rating.objects.filter(booking=booking).first()

            if existing_rating:
                # Nếu đã tồn tại, cập nhật bản ghi Rating hiện có thay vì tạo mới
                existing_rating.rate = random.randint(1, 5)
                existing_rating.cmt = fake.text()
                existing_rating.save()
                print(f"Updated Rating for Booking: {booking.id}")
            else:
                # Nếu chưa tồn tại, tạo bản ghi mới
                Rating.objects.create(
                    booking=booking,
                    rate=random.randint(1, 5),
                    cmt=fake.text()
                )
                print(f"Created Rating for Booking: {booking.id}")


    def create_tour_comments(num_comments=50):
        customers = Customer.objects.all()
        tours = Tour.objects.all()
        for _ in range(num_comments):
            customer = random.choice(customers)
            tour = random.choice(tours)
            TourComment.objects.create(
                customer=customer,
                tour=tour,
                cmt=fake.text()
            )
            print(f"Created Comment for Tour: {tour.name}")


    def create_news(num_news=10):
        staff_users = Staff.objects.all()
        for _ in range(num_news):
            author = random.choice(staff_users)

            News.objects.create(
                title=fake.sentence(),
                content=fake.text(),
                author=author
            )
            print(f"Created News by Author: {author.user.username}")


    def create_news_comments(num_comments=50):
        customers = Customer.objects.all()
        news_list = News.objects.all()
        for _ in range(num_comments):
            customer = random.choice(customers)
            news = random.choice(news_list)
            NewsComment.objects.create(
                customer=customer,
                new=news,
                cmt=fake.text()
            )
            print(f"Created Comment for News: {news.title}")


    def create_news_likes(num_likes=50):
        customers = Customer.objects.all()
        news_list = News.objects.all()
        for _ in range(num_likes):
            customer = random.choice(customers)
            news = random.choice(news_list)
            NewsLike.objects.create(
                customer=customer,
                new=news
            )
            print(f"Created Like for News: {news.title}")


    def create_configs():
        (Config.objects
         .create(key=ConfigKey.AGE_FOR_CHILD_PRICES,
                 value='10'))

        gmail_username = 'drkore13579@gmail.com'
        (Config.objects
         .create(key=ConfigKey.GMAIL_USERNAME,
                 value=gmail_username))

        app_pass_gmail = 'vepa ahut bsnr ryax'
        (Config.objects
         .create(key=ConfigKey.APP_PASS_GMAIL,
                 value=app_pass_gmail))

        (Config.objects
         .create(key=ConfigKey.CONFIRM_EMAIL_SUBJECT,
                 value='Xac nhan dat du lich'))

        (Config.objects
         .create(key=ConfigKey.CONFIRM_EMAIL_MESSAGE,
                 value=('Khach hang: {customer_name} da dat tour: {tour_name}\n'
                        'So nguoi lon: {adult_count}\n'
                        'So tre em: {child_count}\n'
                        'Thoi gian: {time_order}\n'
                        'Tong tien: {total_price}')))

        from django.conf import settings
        settings.EMAIL_HOST_USER = gmail_username
        settings.EMAIL_HOST_PASSWORD = app_pass_gmail


    create_oauth_google_config()
    create_users()
    create_admins()
    create_staff()
    create_customers()
    create_tourist_places()
    create_tags()
    create_tours()
    create_schedule_recurring_weekly()
    create_schedule_recurring_in_week()
    create_schedule_exclude_dates()
    create_bookings()
    create_ratings()
    create_tour_comments()
    create_news()
    create_news_comments()
    create_news_likes()
    create_configs()
