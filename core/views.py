# Create your views here.
from django.http import HttpResponse
from core.models import *
from django.shortcuts import get_object_or_404, render_to_response, redirect
from django.template import RequestContext
from django.core.exceptions import ObjectDoesNotExist

from django import forms

import json

#################
##### FORMS #####
#################

#################
##### VIEWS #####
#################

def index(request):
    data = {}
    return render_to_response("index.html", data, context_instance=RequestContext(request))

def getPlayerData(request):
    response = {}
    if request.method == "POST":
        id = int(request.POST["id"])
        try:
            player = Player.objects.get(id=id)

            response["error"] = 0
            response["id"] = player.id
            response["name"] = player.name
            response["firstName"] = player.firstName
            response["lastName"] = player.lastName
            response["position"] = player.position
            response["team"] = player.team
            response["totalPoints"] = player.totalPoints
            response["cost"] = player.cost
            response["pointsHistory"] = player.pointsHistory
            response["photo"] = player.photo

        except ObjectDoesNotExist:
            response["error"] = 1

    return HttpResponse(json.dumps(response), content_type="application-json")

def getTeamData(request):
    response = {}
    if request.method == "POST":
        name = request.POST["name"]
        players = Player.objects.filter(team=name)
        if len(players) != 0:
            response["players"] = createPlayersArray(players)

    return HttpResponse(json.dumps(response), content_type="application-json")

###################
##### HELPERS #####
###################

def createPlayersArray(players):
    arr = []
    for player in players:
        arr.append({ "id" : player.id,
                     "name" : player.name,
                     "firstName" : player.firstName,
                     "lastName" : player.lastName,
                     "position" : player.position,
                     "totalPoints" : player.totalPoints,
                     "cost" : player.cost })
    return arr