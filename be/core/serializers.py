from .models import *
from rest_framework import serializers
from datetime import time


class UserSerializer(serializers.ModelSerializer):
    department_name = serializers.SerializerMethodField(read_only=True)

    def get_department_name(self, obj):
        if obj.department:
            return obj.department.name

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        request = self.context.get('request')
        if instance.avatar and request:
            rep['avatar'] = request.build_absolute_uri(instance.avatar.url)
        else:
            rep['avatar'] = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlfqFFx7I61FM-RVN76_PLzbkZ-oWWvdxvNA&s'

        return rep

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'department', 'position', 'email', 'username',
                  'phone_number', 'department_name', 'password', 'avatar']
        extra_kwargs = {
            'password': {
                'write_only': True,
                'required': False
            }
        }

    def create(self, validated_data):
        data = validated_data.copy()

        user = User(**data)
        user.set_password(data["password"])
        user.save()

        return user


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'


class AttendanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.SerializerMethodField(read_only=True)
    date_vn = serializers.SerializerMethodField(read_only=True)

    def get_employee_name(self, obj):
        return obj.employee.__str__()

    def get_date_vn(self, obj):
        return obj.date.strftime('%d/%m/%Y')

    class Meta:
        model = Attendance
        fields = '__all__'
        extra_kwargs = {
            "employee": {"write_only": True},
        }


class AttendanceStatsSerializer(AttendanceSerializer):
    status = serializers.SerializerMethodField(read_only=True)

    def get_status(self, obj):
        return obj.get_status()

    class Meta:
        model = AttendanceSerializer.Meta.model
        fields = AttendanceSerializer.Meta.fields
        extra_kwargs = AttendanceSerializer.Meta.extra_kwargs

