# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-10-30 11:47
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bscapp', '0004_auto_20171002_1216'),
    ]

    operations = [
        migrations.AddField(
            model_name='tablerow',
            name='archived',
            field=models.BooleanField(default=False),
        ),
    ]
