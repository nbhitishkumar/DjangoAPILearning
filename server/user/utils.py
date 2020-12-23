from django.db import models


class SoftDeleteManager(models.Manager):
	''' Use this manager to get objects that have a isDeleted field '''
	def get_queryset(self):
		return super(SoftDeleteManager, self).get_queryset().filter(is_deleted=False)
	def all_with_deleted(self):
		return super(SoftDeleteManager, self).get_queryset()
	def deleted_set(self):
		return super(SoftDeleteManager, self).get_queryset().filter(is_deleted=True)