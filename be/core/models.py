from django.db import models
from django.contrib.auth.models import AbstractUser


class Department(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name


class User(AbstractUser):
    avatar = models.ImageField(upload_to='static/avatars', null=True, blank=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    hire_date = models.DateField(null=True, blank=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    position = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    class Meta:
        ordering = ('-id', )
        indexes = [
            models.Index(fields=['first_name'], name='user_first_name_idx'),
            models.Index(fields=['last_name'], name='user_last_name_idx'),
            models.Index(fields=['position'], name='user_position_idx'),
        ]


class Attendance(models.Model):
    APPROVED = 1
    DISAPPROVED = 2
    NOT_YET_APPROVE = 3

    APPROVED_CHOICES = [
        (APPROVED, 'Approve'),
        (DISAPPROVED, 'Disapprove'),
        (NOT_YET_APPROVE, 'Not yet approved'),
    ]

    employee = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    hour = models.DecimalField(decimal_places=1, max_digits=10, null=True, blank=True)
    role = models.CharField(max_length=50, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    status = models.IntegerField(choices=APPROVED_CHOICES, default=3)

    def __str__(self):
        return f"{self.employee.first_name} {self.employee.last_name} - {self.date}"

    def get_status(self):
        status = dict(self.APPROVED_CHOICES)
        return status.get(self.status, None)

