# Generated by Django 3.1.3 on 2020-12-02 10:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0002_users_account'),
    ]

    operations = [
        migrations.AddField(
            model_name='users',
            name='is_shop_verfied',
            field=models.BooleanField(default=False),
        ),
    ]
