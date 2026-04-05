from django.urls import path
from . import views

urlpatterns = [
    path('api/chatbot/', views.chatbot, name='chatbot'),
    path('api/risk-summary/', views.risk_summary_api, name='risk_summary'),
    path('api/network-graph/', views.network_graph_api, name='network_graph'),
    path('api/warehouses/', views.warehouses_api, name='warehouses'),
    path('api/alerts/', views.alerts_api, name='alerts'),
]
