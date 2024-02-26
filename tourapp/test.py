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

    from tours.models import Tour
    from datetime import datetime, timedelta

    date = datetime.strptime('2024-02-28', '%Y-%m-%d')
    tour = Tour.objects.first()
    time = tour.schedulerecurringweekly.time

    r = datetime.combine(date, time)
    print(r)
