from django.conf.urls import url
from .views import plan_trip, generate_log

urlpatterns = [
    url(r'^plan/$', plan_trip, name='plan_trip'),
    url(r'^log/$', generate_log, name='log_trip'),
]