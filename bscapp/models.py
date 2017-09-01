from __future__ import unicode_literals

from django.db import models


class Scorecard(models.Model):
    user_email = models.CharField(max_length=100)
    scorecard_name = models.CharField(max_length=100)

    class Meta:
        app_label = 'bscapp'


class tablerow(models.Model):
    scorecard = models.ForeignKey(Scorecard, on_delete=models.CASCADE)
    table = models.IntegerField()
    year = models.PositiveSmallIntegerField()
    name = models.CharField(max_length=100)
    measure = models.CharField(max_length=100)
    target = models.CharField(max_length=100)
    actual = models.CharField(max_length=100)
    plan_of_action = models.CharField(max_length=100)

    class Meta:
        app_label = 'bscapp'


class Observation(models.Model):
    tablerow = models.ForeignKey(tablerow, on_delete=models.CASCADE)
    value = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True, blank=True)

    class Meta:
        app_label = 'bscapp'
