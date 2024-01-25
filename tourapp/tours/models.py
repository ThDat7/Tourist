from django.contrib.auth.models import AbstractUser
from django.db import models
from cloudinary.models import CloudinaryField
from ckeditor.fields import RichTextField
from django.utils.translation import gettext_lazy as _


# Create your models here.
class UserRole(models.CharField):
    ADMIN = "ADMIN", _("Admin")
    STAFF = "STAFF", _("Staff")
    CUSTOMER = "CUSTOMER", _("Customer")


class User(AbstractUser):
    avatar = CloudinaryField('avatar', null=True)
    role = models.CharField(max_length=10, choices=UserRole, default=UserRole.CUSTOMER)


class Customer(models.Model):
    pass


class Staff(models.Model):
    pass


class BaseModel(models.Model):
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    active = models.BooleanField(default=True)

    class Meta:
        abstract = True


class Province(models.Model):
    name = models.CharField(max_length=50, null=False)


class Tag(BaseModel):
    name = models.CharField(max_length=50, null=False)
    tours = models.ManyToManyField('Tour')


class Tour(BaseModel):
    name = models.CharField(max_length=150, null=False)
    description = RichTextField(null=False)
    adult_price = models.IntegerField(null=False)
    child_price = models.IntegerField(null=False)
    tags = models.ManyToManyField(Tag)


class ScheduleRecurringDaily(models.Model):
    tour = models.OneToOneField(Tour, on_delete=models.CASCADE, null=False)
    time = models.DateTimeField(null=False)


class ScheduleRecurringWeekly(models.Model):
    tour = models.OneToOneField(Tour, on_delete=models.CASCADE, null=False)
    time = models.DateTimeField(null=False)


class ScheduleRecurringInWeek(models.Model):
    schedule = models.ForeignKey(ScheduleRecurringWeekly, on_delete=models.CASCADE, null=False)
    day_in_week = models.IntegerField(null=False)


class ScheduleOnetime(models.Model):
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, null=False)
    time = models.DateTimeField(null=False)


class BookingStatus(models.TextChoices):
    UNPAID = "UNPAID", _("Unpaid")
    PAID = "PAID", _("Paid")


class Booking(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, null=False)
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, null=False)

    time = models.DateTimeField(auto_now_add=True)
    adult_price = models.IntegerField(null=False)
    child_price = models.IntegerField(null=False)
    status = models.CharField(max_length=20, choices=BookingStatus, default=BookingStatus.UNPAID)


class Rating(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, null=False)
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, null=False)

    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    rate = models.DecimalField(max_digits=2,
                               decimal_places=1,
                               choices=(
                               (0, 0), (0.5, 0.5), (1, 1), (1.5, 1.5), (2, 2), (2.5, 2.5), (3, 3), (3.5, 3.5), (4, 4),
                               (4.5, 4.5), (5, 5)),
                               null=False)
    cmt = models.CharField(max_length=200)


class TourComment(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, null=False)
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, null=False)

    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    cmt = models.CharField(max_length=200, null=False)


class News(BaseModel):
    title = models.CharField(max_length=150, null=False)
    content = RichTextField(null=False)
    owner = models.ForeignKey(Staff, on_delete=models.SET_NULL, null=True)


class NewsComment(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, null=False)
    new = models.ForeignKey(News, on_delete=models.CASCADE, null=False)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    cmt = models.CharField(max_length=200, null=False)


class NewsLike(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, null=False)
    new = models.ForeignKey(News, on_delete=models.CASCADE, null=False)


class ConfigKey(models.TextChoices):
    AGE_FOR_CHILD_PRICES = "CHILD_AGE", _("Age for child prices")


class Config(models.Model):
    key = models.CharField(max_length=100, choices=ConfigKey.choices, null=False)
    value = models.CharField(max_length=150, null=False)
