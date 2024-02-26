from allauth.account.signals import user_signed_up
from django.dispatch import receiver

from tours.models import Customer


@receiver(user_signed_up)
def create_customer_for_user(sender, **kwargs):
    user = kwargs['user']
    customer = Customer.objects.create(user=user)
    customer.save()
