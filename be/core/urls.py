from rest_framework import routers
from core import views
from django.urls import path, include

router = routers.DefaultRouter()
router.register(r'employees', views.UserViewSet, basename='employees')
router.register(r'departments', views.DepartmentViewSet, basename='departments')
router.register(r'attendance', views.AttendanceViewSet, basename='attendance')
router.register(r'stats', views.AttendanceStatsViewSet, basename='attendances-stats')

urlpatterns = [
    path('', include(router.urls))
]