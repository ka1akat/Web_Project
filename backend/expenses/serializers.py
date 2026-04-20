from rest_framework import serializers
from .models import Category, Expense, Budget, UserProfile
from django.contrib.auth.models import User


class SimpleSerializer(serializers.Serializer):
    message = serializers.CharField()


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['work', 'university', 'city']


class UserSerializer(serializers.ModelSerializer):
    work = serializers.CharField(source='profile.work', default='', allow_blank=True)
    university = serializers.CharField(source='profile.university', default='', allow_blank=True)
    city = serializers.CharField(source='profile.city', default='', allow_blank=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'work', 'university', 'city']

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})

        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.save()

        profile, _ = UserProfile.objects.get_or_create(user=instance)
        profile.work = profile_data.get('work', profile.work)
        profile.university = profile_data.get('university', profile.university)
        profile.city = profile_data.get('city', profile.city)
        profile.save()

        return instance


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        read_only_fields = ['user']


class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = '__all__'
        read_only_fields = ['user']


class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = '__all__'
        read_only_fields = ['user']