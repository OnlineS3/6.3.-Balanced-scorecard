from django.conf import settings

class BscAppDBRouter(object):
    """
    A router to control app1 db operations
    """
    def db_for_read(self, model, **hints):
        if not settings.DATABASES.has_key('db_bscapp'):
            return None
        if model._meta.app_label == 'bscapp':
            return 'db_bscapp'
        return None

    def db_for_write(self, model, **hints):
        if not settings.DATABASES.has_key('db_bscapp'):
            return None
        if model._meta.app_label == 'bscapp':
            return 'db_bscapp'
        return None

    def allow_relation(self, obj1, obj2, **hints):
        if not settings.DATABASES.has_key('db_bscapp'):
            return None
        if obj1._meta.app_label == 'bscapp' or obj2._meta.app_label == 'bscapp':
            return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if not settings.DATABASES.has_key('db_bscapp'):
            return None
        if db == 'db_bscapp':
            return app_label == 'bscapp'
        return None