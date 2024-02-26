def set_config():
    from tours.models import Config, ConfigKey

    email_host_user = Config.objects.filter(key=ConfigKey.GMAIL_USERNAME).first()
    email_host_password = Config.objects.filter(key=ConfigKey.APP_PASS_GMAIL).first()

    from django.conf import settings
    settings.EMAIL_HOST_USER = email_host_user.value if email_host_user else None
    settings.EMAIL_HOST_PASSWORD = email_host_password.value if email_host_password else None
