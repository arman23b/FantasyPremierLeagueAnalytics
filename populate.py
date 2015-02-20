import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "webApp.settings")

import django
django.setup()

from core.models import *
import json

json_data = open("../players.json")
data = json.load(json_data)
json_data.close()
length = len(data.values())
i = 0
for player in data.values():
    pointsHistory = (map(lambda x : x[-1], player["fixture_history"]["all"]))
    new_player = Player.objects.create(id=player["id"],
                                       name=player["web_name"],
                                       firstName=player["first_name"],
                                       lastName=player["second_name"],
                                       position=player["type_name"],
                                       totalPoints=int(player["total_points"]),
                                       cost=int(player["now_cost"]),
                                       team=player["team_name"],
                                       pointsHistory=pointsHistory,
                                       photo=player["photo"])
    new_player.save()
    print new_player.name + (" %.1f" % (float(i)*100/length)) + "%"
    i += 1    