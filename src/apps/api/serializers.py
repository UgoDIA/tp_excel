from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from .models import *

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
    
    def create(self, validated_data):
        groups_data = validated_data.pop('groups', [])
        user = User(**validated_data)
        user.set_password(user.username)
        user.save()
        if groups_data:
            user.groups.set(groups_data)

        return user

class CalcSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalcSimple
        fields = '__all__'  
        
class CategorieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorie
        fields = '__all__'  

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'  

class CoureurSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    categorie = CategorieSerializer(read_only=True)

    id_course = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(),
        source='course',  
        write_only=True
    )
    id_categorie = serializers.PrimaryKeyRelatedField(
        queryset=Categorie.objects.all(),
        source='categorie',  
        write_only=True
    )

    class Meta:
        model = Coureur
        fields = [
            'id_coureur',
            'nom',
            'prenom',
            'sexe',
            'date_de_naissance',
            'categorie',  
            'id_categorie',  
            'taille_tee_shirt',
            'course',  
            'id_course',  
            'prix_club',
            'repas_avant_course',
            'prix_du_repas_avant_course',
            'repas_apres_course',
            'prix_du_repas_apres_course',
            'total_coureur',
        ]
