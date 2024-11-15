from django.shortcuts import render
from django.db.models import Case, When, Value, CharField, Q
from .models import *
from core import serializers, perms
from rest_framework import viewsets, generics, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response


class UserViewSet(viewsets.ViewSet, generics.ListCreateAPIView, generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = serializers.UserSerializer
    permission_classes = [perms.IsAdminUserOrReadOnly]

    @action(methods=['get', 'patch'], url_path='current-user', detail=False)
    def get_current_user(self, request):
        user = request.user

        if request.method == 'GET':
            return Response(serializers.UserSerializer(user, context={'request': request}).data)

        if request.method == 'PATCH':
            for k, v in request.data.items():
                if k == 'password':
                    user.set_password(v)
                else:
                    setattr(user, k, v)
            user.save()

            return Response(serializers.UserSerializer(user, context={'request': request}).data)
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def get_queryset(self):
        queryset = self.queryset

        q = self.request.query_params.get('q')
        if q:
            queryset = queryset.filter(Q(first_name__icontains=q) |
                                       Q(last_name__icontains=q) |
                                       Q(position__icontains=q))

        dept = self.request.query_params.get('dept')
        if dept and dept != '0':
            queryset = queryset.filter(department=int(dept))

        return queryset.distinct()

    def get_permissions(self):
        if self.action == 'get_current_user':
            return [perms.IsAuthenticated()]

        return [permission() for permission in self.permission_classes]


class DepartmentViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Department.objects.all()
    serializer_class = serializers.DepartmentSerializer


class AttendanceViewSet(viewsets.ViewSet, generics.ListCreateAPIView, generics.RetrieveUpdateDestroyAPIView):
    queryset = Attendance.objects.all()
    serializer_class = serializers.AttendanceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = self.queryset
        queryset = queryset.filter(employee=self.request.user)

        date = self.request.query_params.get('date', None)
        if date:
            queryset = queryset.filter(date=date)

        return queryset

    @action(methods=['get'], detail=False, url_path='stats')
    def stats(self, request, pk=None):
        serializer = serializers.AttendanceStatsSerializer(self.get_queryset(), many=True, context={'request': request})
        return Response(serializer.data)


class AttendanceStatsViewSet(viewsets.ViewSet):
    def process_attendance(self, attendance_records):
        summary = {
            'approved': 0,
            'disapproved': 0,
            'not_yet_approved': 0,
        }

        for record in attendance_records:
            if record.status == 1:
                summary['approved'] += record.hour
            if record.status == 2:
                summary['disapproved'] += record.hour
            if record.status == 3:
                summary['not_yet_approved'] += record.hour

        return summary

    def list(self, request):
        queryset = Attendance.objects.all()

        if request.user and request.user.is_authenticated:
            queryset = queryset.filter(employee=request.user).all()

            date = self.request.query_params.get('date', None)
            if date:
                queryset = queryset.filter(date=date)

            summary = self.process_attendance(queryset)

            return Response(summary)

        Response({'message': "No data found."}, status=status.HTTP_204_NO_CONTENT)
