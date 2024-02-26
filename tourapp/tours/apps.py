from django.apps import AppConfig

from tours.configs import set_config


class ToursConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'tours'

    def ready(self):
        import tours.signals

        set_config()
