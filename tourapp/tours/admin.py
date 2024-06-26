import types

from ckeditor_uploader.widgets import CKEditorUploadingWidget
from django import forms
from django.contrib import admin
from django.utils.html import mark_safe

from tours.models import Tour, Customer, News, Rating, Booking, Config, ScheduleRecurringWeekly, Tag, TouristPlace, \
    Staff, User, ScheduleRecurringInWeek, ScheduleExcludeDate, TourComment, NewsComment, SavedTours


# Register your models here.
class UserAdmin(admin.ModelAdmin):
    list_display = ['pk', 'last_name', 'first_name', 'username']
    search_fields = ['last_name', 'first_name', 'username']
    list_filter = ['last_name', 'first_name', 'username']


class UserInlineAdmin(admin.StackedInline):
    model = User


class CustomerAdmin(admin.ModelAdmin):
    inlines = [UserInlineAdmin]
    search_fields = ['id', 'user']
    list_filter = ['user']


class StaffAdmin(admin.ModelAdmin):
    inlines = [UserInlineAdmin]
    search_fields = ['id', 'user']
    list_filter = ['user']


class TouristPlaceAdmin(admin.ModelAdmin):
    list_display = ['pk', 'name']
    search_fields = ['name', ]
    list_filter = ['name']


class TagAdmin(admin.ModelAdmin):
    list_display = ['pk', 'name']
    search_fields = ['name', ]
    list_filter = ['name']


class TagInlineAdmin(admin.StackedInline):
    model = Tour.tags.through


class ScheduleRecurringInWeekInlineAdmin(admin.StackedInline):
    model = ScheduleRecurringInWeek


class ScheduleExcludeDateInlineAdmin(admin.StackedInline):
    model = ScheduleExcludeDate


class ScheduleRecurringWeeklyAdmin(admin.ModelAdmin):
    inlines = [ScheduleRecurringInWeekInlineAdmin, ScheduleExcludeDateInlineAdmin]


class ScheduleRecurringWeeklyInlineAdmin(admin.StackedInline):
    model = ScheduleRecurringWeekly
    show_change_link = True


class TourForm(forms.ModelForm):
    description = forms.CharField(widget=CKEditorUploadingWidget())

    class Meta:
        model = Tour
        fields = '__all__'


class TourAdmin(admin.ModelAdmin):
    list_display = ['pk', 'name', 'place']
    search_fields = ['name', 'description', 'place']
    list_filter = ['place']
    inlines = [TagInlineAdmin, ScheduleRecurringWeeklyInlineAdmin]
    readonly_fields = ['main_image_preview']
    form = TourForm

    def main_image_preview(self, obj):
        if obj:
            return mark_safe('<img src="/static/{url}" width="120"/>'.format(url=obj.main_image.name))


class BookingAdmin(admin.ModelAdmin):
    list_display = ['pk', 'customer', 'tour']
    search_fields = ['customer', 'tour']
    list_filter = ['status']


class RatingAdmin(admin.ModelAdmin):
    list_display = ['pk', 'booking', 'rate']
    search_fields = ['name', 'booking', 'rate', 'cmt']
    list_filter = ['rate']


class TourCommentAdmin(admin.ModelAdmin):
    list_display = ['pk', 'customer', 'tour', 'cmt']
    search_fields = ['name', 'customer', 'tour', 'cmt']
    list_filter = ['cmt', 'tour']


class NewsForm(forms.ModelForm):
    content = forms.CharField(widget=CKEditorUploadingWidget())

    class Meta:
        model = News
        fields = '__all__'


class NewsAdmin(admin.ModelAdmin):
    list_display = ['pk', 'title', 'author', ]
    search_fields = ['name', 'title', 'content', 'author']
    list_filter = ['author']
    form = NewsForm


class NewsCommentAdmin(admin.ModelAdmin):
    list_display = ['pk', 'new', 'customer', 'cmt']
    search_fields = ['name', 'new', 'customer', 'comment']
    list_filter = ['customer', 'new']


class ConfigAdmin(admin.ModelAdmin):
    list_display = ['pk', 'key', 'value']
    search_fields = ['name', 'key', 'value']
    list_filter = ['key']


admin.site.register(Tour, TourAdmin)
admin.site.register(Customer)
admin.site.register(Config, ConfigAdmin)
admin.site.register(News, NewsAdmin)
admin.site.register(Rating, RatingAdmin)
admin.site.register(Booking, BookingAdmin)
admin.site.register(Tag, TagAdmin)
admin.site.register(TouristPlace, TouristPlaceAdmin)
admin.site.register(User, UserAdmin)
admin.site.register(TourComment, TourCommentAdmin)
admin.site.register(NewsComment, NewsCommentAdmin)
admin.site.register(ScheduleRecurringWeekly, ScheduleRecurringWeeklyAdmin)
