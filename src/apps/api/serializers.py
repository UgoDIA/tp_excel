from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

User = get_user_model()


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']


class UserSerializer(serializers.ModelSerializer):
    groups = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Group.objects.all()
    )

    class Meta:
        model = User
        fields = ['id', 'username', 'email',
                  'groups', 'first_name', 'last_name']

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['groups'] = GroupSerializer(
            instance.groups.all(), many=True).data
        return response
