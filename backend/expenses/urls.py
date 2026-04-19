from django.urls import path
from .views import *

urlpatterns = [
    path('categories/', CategoryListCreateView.as_view()),
    path('expenses/', ExpenseListCreateView.as_view()),
    path('expenses/<int:pk>/', ExpenseDetailView.as_view()),
    path('budget/', BudgetListCreateView.as_view()),
    path('budget/<int:pk>/', BudgetDetailView.as_view()),

    path('register/', register),
    path('login/', login),
    path('statistics/', statistics),
    path('warnings/', warnings),
    path('logout/', logout),
    
    path('categories/', CategoryListCreateView.as_view()),
    path('expenses/', ExpenseListCreateView.as_view()),
    path('expenses/<int:pk>/', ExpenseDetailView.as_view()),
    path('budget/', BudgetListCreateView.as_view()),

    path('user/', UserView.as_view()),
path('change-password/', ChangePasswordView.as_view()),
]