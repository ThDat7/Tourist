from django.contrib.auth.models import AbstractUser
from django.db import models
from cloudinary.models import CloudinaryField
from ckeditor.fields import RichTextField
from django.utils.translation import gettext_lazy as _


# Create your models here.


class User(AbstractUser):
    avatar = CloudinaryField('avatar', null=False)


class Admin(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=False)


class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=False)


class Staff(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=False)


class BaseModel(models.Model):
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class TouristPlace(models.Model):
    name = models.CharField(max_length=50, null=False)


class Tag(BaseModel):
    name = models.CharField(max_length=50, null=False)
    is_active = models.BooleanField(default=True)


class Tour(BaseModel):
    name = models.CharField(max_length=150, null=False)
    main_image = CloudinaryField('main_image', null=False)
    description = RichTextField(null=False)
    place = models.ForeignKey(TouristPlace, on_delete=models.CASCADE, null=False)
    is_active = models.BooleanField(default=True)
    adult_price = models.IntegerField(null=False)
    child_price = models.IntegerField(null=False)
    tags = models.ManyToManyField(Tag)
    author = models.ForeignKey(Staff, on_delete=models.SET_NULL, null=True)


# That's not need
class ScheduleRecurringDaily(models.Model):
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, null=False)
    time = models.DateTimeField(null=False)


class ScheduleRecurringWeekly(models.Model):
    tour = models.OneToOneField(Tour, on_delete=models.CASCADE, null=False)
    starting_date = models.DateField(null=False)
    time = models.TimeField(null=False)


class ScheduleRecurringInWeek(models.Model):
    schedule = models.ForeignKey(ScheduleRecurringWeekly, on_delete=models.CASCADE, null=False)
    day_in_week = models.IntegerField(null=False)


class ScheduleExcludeDate(models.Model):
    recurring = models.ForeignKey(ScheduleRecurringWeekly, on_delete=models.CASCADE, null=False)
    date = models.DateField(null=False)


class BookingStatus(models.TextChoices):
    UNPAID = "UNPAID", _("Chưa thanh toán")
    WAITING_FOR_DEPARTURE = "WAITING_FOR_DEPARTURE", _("Đợi khởi hành")
    COMPLETED = "COMPLETED", _("Đã đi")
    CANCELLED = "CANCELLED", _("Đã hủy")


class Booking(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, null=False)
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, null=False)

    time = models.DateTimeField(auto_now_add=True)
    adult_price = models.IntegerField(null=False)
    child_price = models.IntegerField(null=False)
    status = models.CharField(max_length=50, choices=BookingStatus, default=BookingStatus.UNPAID)


class Rating(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, null=False)
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, null=False)

    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    rate = models.DecimalField(max_digits=2,
                               decimal_places=1,
                               null=False)
    cmt = models.CharField(max_length=200)


class TourComment(BaseModel):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, null=False)
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, null=False)

    cmt = models.CharField(max_length=200, null=False)


class News(BaseModel):
    title = models.CharField(max_length=150, null=False)
    content = RichTextField(null=False)
    author = models.ForeignKey(Staff, on_delete=models.SET_NULL, null=True)


class NewsComment(BaseModel):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, null=False)
    new = models.ForeignKey(News, on_delete=models.CASCADE, null=False)
    cmt = models.CharField(max_length=200, null=False)


class NewsLike(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, null=False)
    new = models.ForeignKey(News, on_delete=models.CASCADE, null=False)


class ConfigKey(models.TextChoices):
    AGE_FOR_CHILD_PRICES = "CHILD_AGE", _("Age for child prices")


class Config(models.Model):
    key = models.CharField(max_length=100, choices=ConfigKey.choices, null=False)
    value = models.CharField(max_length=150, null=False)
