from django.db import models
from django.conf import settings
from datetime import datetime
from django.utils import timezone
from user.utils import SoftDeleteManager

# Create your models here.

class States(models.Model):
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, limit_choices_to={'is_deleted': False, 'is_blocked': False}, related_name='state_created_by', null=True)
    state_name = models.CharField(max_length=255)
    created_at = models.DateTimeField(default=datetime.now, blank=True)
    updated_at = models.DateTimeField(default=datetime.now, blank=True)
    is_deleted = models.BooleanField(default=False)
    is_blocked = models.BooleanField(default=False)

    class Meta:
        db_table = 'states'

class Cities(models.Model):
    state       = models.ForeignKey(States, limit_choices_to={'is_deleted': False, 'is_blocked': False}, on_delete=models.CASCADE, related_name='city_state_id',null=True)
    created_by  = models.ForeignKey(settings.AUTH_USER_MODEL, limit_choices_to={'is_deleted': False, 'is_blocked': False}, on_delete=models.CASCADE, related_name='citylocation_created_by', null=True)
    city_name   = models.CharField(max_length=255)
    created_at  = models.DateTimeField(default=datetime.now, blank=True)
    updated_at  = models.DateTimeField(default=datetime.now, blank=True)
    is_deleted  = models.BooleanField(default=False)
    is_blocked  = models.BooleanField(default=False)
    class Meta:
        db_table = 'cities'

    def delete(self, *args, **kwargs):
        self.is_deleted = True
        self.save()

class Area(models.Model):
    state       = models.ForeignKey(States, limit_choices_to={'is_deleted': False, 'is_blocked': False}, on_delete=models.CASCADE, related_name='area_state_id',null=True)
    created_by  = models.ForeignKey(settings.AUTH_USER_MODEL, limit_choices_to={'is_deleted': False, 'is_blocked': False}, on_delete=models.CASCADE, related_name='arealocation_created_by', null=True)
    city       = models.ForeignKey(Cities, limit_choices_to={'is_deleted': False, 'is_blocked': False}, on_delete=models.CASCADE, related_name='area_city_id',null=True)
    area_name   = models.CharField(max_length=255)
    pin_code    = models.IntegerField(default=0, null=True)
    created_at  = models.DateTimeField(default=datetime.now, blank=True)
    updated_at  = models.DateTimeField(default=datetime.now, blank=True)
    is_deleted  = models.BooleanField(default=False)
    is_blocked  = models.BooleanField(default=False)

    class Meta:
        db_table = 'area'

    def delete(self, *args, **kwargs):
        self.is_deleted = True
        self.save()


