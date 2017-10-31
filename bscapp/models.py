from __future__ import unicode_literals

from django.db import models


class Scorecard(models.Model):
    user_email = models.CharField(max_length=100)
    scorecard_name = models.CharField(max_length=100)
    share_id = models.CharField(max_length=40)
    share_permissions = models.IntegerField()
    # 0 = private
    # 1 = viewable
    # 2 = editable

    class Meta:
        app_label = 'bscapp'


class tablerow(models.Model):
    scorecard = models.ForeignKey(Scorecard, on_delete=models.CASCADE)
    table = models.IntegerField()
    year = models.CharField(max_length=4)
    name = models.CharField(max_length=100)
    measure = models.CharField(max_length=100)
    target = models.CharField(max_length=100)
    actual = models.CharField(max_length=100)
    plan_of_action = models.CharField(max_length=100)
    archived = models.BooleanField(default=False)

    class Meta:
        app_label = 'bscapp'


class Observation(models.Model):
    tablerow = models.ForeignKey(tablerow, on_delete=models.CASCADE)
    value = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True, blank=True)

    class Meta:
        app_label = 'bscapp'

class Shares(models.Model):
	scorecard = models.ForeignKey(Scorecard, on_delete=models.CASCADE)
	shared_with = models.CharField(max_length=100)

	class Meta:
		app_label = 'bscapp'
