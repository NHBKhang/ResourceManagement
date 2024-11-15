from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework import permissions


class IsAdminUserOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in 'POST':
            return True

        return request.user.is_authenticated and request.user.is_superuser
