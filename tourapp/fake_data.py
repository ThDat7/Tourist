import random
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
    from tours.models import Customer, Staff, Tag, TouristPlace, Tour, ScheduleRecurringDaily, ScheduleRecurringWeekly, \
        ScheduleRecurringInWeek, ScheduleExcludeDate, BookingStatus, Booking, Rating, TourComment, News, NewsComment, \
        NewsLike, Config, ConfigKey, User, Admin


    # Tạo dữ liệu giả cho User
    def create_users(num_users=20):
        for _ in range(num_users):
            username = fake.user_name()
            email = fake.email()
            password = make_password(fake.password())
            avatar_url = fake.image_url()
            user = User.objects.create(username=username, email=email, password=password, avatar='https://res.cloudinary.com/dxxwcby8l/image/upload/v1690537829/oq9paksbwpwnuxybhvbw.jpg')
            print(f"Created User: {user.username}, Password: {fake.password()}")

    def create_admins(num_admins=1):
        for _ in range(num_admins):
            username = 'admin'
            email = fake.email()
            password = '123'
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


    def create_customers(num_customers=50):
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
        staff_users = User.objects.filter(is_staff=True)

        if not staff_users.exists():
            print("No staff users found.")
            return

        for _ in range(num_tours):
            place = random.choice(places)
            tour_author = random.choice(staff_users)

            # Kiểm tra xem tour_author có phải là một nhân viên hay không
            if hasattr(tour_author, 'staff'):
                author = tour_author.staff
            else:
                author = None

            tour = Tour.objects.create(
                name=fake.company(),
                description=fake.text(),
                place=place,
                adult_price=random.randint(100, 500),
                child_price=random.randint(50, 250),
                author=author
            )
            tour.tags.set(random.choices(tags, k=random.randint(1, 3)))
            print(f"Created Tour: {tour.name}")


    # Tạo dữ liệu giả cho ScheduleRecurringDaily
    def create_schedule_recurring_daily(num_schedules=10):
        tours = Tour.objects.all()
        for _ in range(num_schedules):
            tour = random.choice(tours)
            ScheduleRecurringDaily.objects.create(tour=tour, time=fake.date_time())
            print(f"Created ScheduleRecurringDaily for Tour: {tour.name}")


    # Tạo dữ liệu giả cho ScheduleRecurringWeekly
    def create_schedule_recurring_weekly(num_schedules=5):
        tours = Tour.objects.all()
        for tour in tours:
            if not ScheduleRecurringWeekly.objects.filter(tour=tour).exists():
                starting_date = fake.date_time_this_year()  # Sử dụng một ngày giả ngẫu nhiên trong năm này
                time = fake.time()
                ScheduleRecurringWeekly.objects.create(tour=tour, starting_date=starting_date, time=time)
                print(f"Created ScheduleRecurringWeekly for Tour: {tour.name}")


    # Tạo dữ liệu giả cho ScheduleRecurringInWeek
    def create_schedule_recurring_in_week(num_schedules=5):
        weekly_schedules = ScheduleRecurringWeekly.objects.all()
        for _ in range(num_schedules):
            weekly_schedule = random.choice(weekly_schedules)
            ScheduleRecurringInWeek.objects.create(schedule=weekly_schedule, day_in_week=random.randint(1, 7))
            print(f"Created ScheduleRecurringInWeek for Tour: {weekly_schedule.tour.name}")


    # Tạo dữ liệu giả cho ScheduleExcludeDate
    def create_schedule_exclude_dates(num_dates=5):
        weekly_schedules = ScheduleRecurringWeekly.objects.all()
        for _ in range(num_dates):
            weekly_schedule = random.choice(weekly_schedules)
            date = fake.date()
            ScheduleExcludeDate.objects.create(recurring=weekly_schedule, date=date)
            print(f"Created ScheduleExcludeDate for Tour: {weekly_schedule.tour.name}")


    # Tạo dữ liệu giả cho Booking
    def create_bookings(num_bookings=50):
        customers = Customer.objects.all()

        if not customers.exists():
            print("No customers found.")
            return

        tours = Tour.objects.all()
        for _ in range(num_bookings):
            customer = random.choice(customers)
            tour = random.choice(tours)
            booking = Booking.objects.create(
                customer=customer,
                tour=tour,
                adult_price=tour.adult_price,
                child_price=tour.child_price,
                status=random.choice([status[0] for status in BookingStatus.choices])
            )
            print(f"Created Booking: {booking.id}")


    # Tạo dữ liệu giả cho Rating
    def create_ratings(num_ratings=50):
        customers = Customer.objects.all()
        tours = Tour.objects.all()
        for _ in range(num_ratings):
            customer = random.choice(customers)
            tour = random.choice(tours)
            Rating.objects.create(
                customer=customer,
                tour=tour,
                rate=random.randint(1, 5),
                cmt=fake.text()
            )
            print(f"Created Rating for Tour: {tour.name}")


    # Tạo dữ liệu giả cho TourComment
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


    # Tạo dữ liệu giả cho News
    def create_news(num_news=10):
        staff_users = User.objects.filter(is_staff=True)
        for _ in range(num_news):
            author = random.choice(staff_users)

            # Kiểm tra xem tác giả có phải là một nhân viên hay không
            if hasattr(author, 'staff'):
                staff_member = author.staff
                author_username = author.username
            else:
                staff_member = None
                author_username = "Anonymous"

            News.objects.create(
                title=fake.sentence(),
                content=fake.text(),
                author=staff_member
            )
            print(f"Created News by Author: {author_username}")


    # Tạo dữ liệu giả cho NewsComment
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


    # Tạo dữ liệu giả cho NewsLike
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


    # Tạo dữ liệu giả cho Config
    def create_configs(num_configs=5):
        for _ in range(num_configs):
            key = random.choice([config[0] for config in ConfigKey.choices])
            value = fake.word()
            Config.objects.create(key=key, value=value)
            print(f"Created Config: {key} - {value}")


    create_users()
    create_admins()
    create_staff()
    create_customers()
    create_tourist_places()
    create_tags()
    create_tours()
    create_schedule_recurring_daily()
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
