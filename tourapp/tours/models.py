from django.contrib.auth.models import AbstractUser
from django.db import models
from cloudinary.models import CloudinaryField
from ckeditor.fields import RichTextField
from django.utils.translation import gettext_lazy as _


# Create your models here.


class User(AbstractUser):
    avatar = CloudinaryField('avatar', null=False)

    def __str__(self):
        return self.username


class Admin(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=False)


class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=False)
    phone_number = models.CharField(max_length=15, null=False)

    def __str__(self):
        return self.user.__str__()

    @property
    def name(self):
        return self.user.last_name + " " + self.user.first_name


class Staff(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=False)

    def __str__(self):
        return self.user.__str__()

    @property
    def name(self):
        return self.user.last_name + " " + self.user.first_name


class BaseModel(models.Model):
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class TouristPlace(models.Model):
    name = models.CharField(max_length=50, null=False)

    def __str__(self):
        return self.name


class Tag(BaseModel):
    name = models.CharField(max_length=50, null=False)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Tour(BaseModel):
    name = models.CharField(max_length=150, null=False)
    main_image = models.ImageField(upload_to='tours/%Y/%m', default=None)
    description = RichTextField(null=False)
    place = models.ForeignKey(TouristPlace, on_delete=models.CASCADE, null=False)
    is_active = models.BooleanField(default=True)
    adult_price = models.IntegerField(null=False)
    child_price = models.IntegerField(null=False)
    tags = models.ManyToManyField(Tag)
    author = models.ForeignKey(Staff, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.name


class SavedTours(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, null=False)
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, null=False)


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

    time_start = models.DateTimeField(null=False)
    time_order = models.DateTimeField(auto_now_add=True)
    adult_price = models.IntegerField(null=False)
    child_price = models.IntegerField(null=False)

    adult_count = models.IntegerField(null=False)
    child_count = models.IntegerField(null=False)

    status = models.CharField(max_length=50, choices=BookingStatus, default=BookingStatus.UNPAID)


class Rating(models.Model):
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, null=False)

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
    main_image = models.ImageField(upload_to='news/%Y/%m', default=None)
    content = RichTextField(null=False)
    author = models.ForeignKey(Staff, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.title


class NewsComment(BaseModel):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, null=False)
    new = models.ForeignKey(News, on_delete=models.CASCADE, null=False)
    cmt = models.CharField(max_length=200, null=False)


class NewsLike(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, null=False)
    new = models.ForeignKey(News, on_delete=models.CASCADE, null=False)


class ConfigKey(models.TextChoices):
    AGE_FOR_CHILD_PRICES = "CHILD_AGE", _("Age for child prices")

    GMAIL_USERNAME = "GMAIL_USERNAME", _("Gmail username")
    APP_PASS_GMAIL = "APP_PASS_GMAIL", _("App password for gmail")
    CONFIRM_EMAIL_SUBJECT = "CONFIRM_EMAIL_SUBJECT", _("Confirm email subject")
    CONFIRM_EMAIL_MESSAGE = "CONFIRM_EMAIL_MESSAGE", _("Confirm email message")


class Config(models.Model):
    key = models.CharField(max_length=100, choices=ConfigKey.choices, null=False)
    value = models.CharField(max_length=500, null=False)

    def __str__(self):
        return self.key
