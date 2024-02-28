def set_config():
    from django.conf import settings
    from django.db import connection, ProgrammingError

    from tours.models import Config, ConfigKey

    try:
        if Config._meta.db_table in connection.introspection.table_names():
            email_host_user = Config.objects.filter(key=ConfigKey.GMAIL_USERNAME).first()
            email_host_password = Config.objects.filter(key=ConfigKey.APP_PASS_GMAIL).first()

            settings.EMAIL_HOST_USER = email_host_user.value if email_host_user else None
            settings.EMAIL_HOST_PASSWORD = email_host_password.value if email_host_password else None
        else:
            print("Bảng Config không tồn tại trong cơ sở dữ liệu.")
    except ProgrammingError:
        print("Lỗi khi thực hiện truy vấn đến cơ sở dữ liệu.")
