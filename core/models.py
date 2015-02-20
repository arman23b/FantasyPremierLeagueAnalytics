from django.db import models
from django import forms

class Player(models.Model):
    name = models.CharField(max_length=200)
    firstName = models.CharField(max_length=200)
    lastName = models.CharField(max_length=200)
    position = models.CharField(max_length=200)
    totalPoints = models.IntegerField()
    cost = models.IntegerField()
    team = models.CharField(max_length=200)
    pointsHistory = models.CommaSeparatedIntegerField(max_length=38)
    photo = models.CharField(max_length=200)
    pointsPerGame = models.CharField(max_length=200)

    def __unicode__(self):
        return self.name