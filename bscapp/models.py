from __future__ import unicode_literals

from django.conf import settings
from django.db import models

# Create your models here.

class Scorecard(models.Model):
	user_email = models.CharField(max_length=100)
	scorecard_name = models.CharField(max_length=100)

	class Meta:
		app_label = 'bscapp'

class tablerow(models.Model):
	scorecard = models.ForeignKey(Scorecard, on_delete=models.CASCADE)
	table = models.IntegerField()
	name = models.CharField(max_length=100)
	measure = models.CharField(max_length=100)
	target = models.CharField(max_length=100)
	plan_of_action = models.CharField(max_length=100)

	class Meta:
		app_label = 'bscapp'