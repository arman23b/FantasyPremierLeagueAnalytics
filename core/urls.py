from django.conf.urls import patterns, url
 
from core import views
 
urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'^playerData$', views.getPlayerData, name='getPlayerData'),
    url(r'^teamData$', views.getTeamData, name='getTeamData'),
)