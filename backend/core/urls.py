"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from core.views_chat import chat_with_ollama

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/appliances/', include('appliances.urls')),
    path('api/bookings/', include('bookings.urls')),
    path('api/installations/', include('installations.urls')),
    path('api/recommend/', include('ml_recommend.urls')),
    path('api/bi/', include('ml_forecast.urls')),
    path('api/churn/', include('ml_churn.urls')),
    path('api/simulation/', include('simulation.urls')),
    path('api/chat/', chat_with_ollama, name='chat_with_ollama'),
]

import os
from pathlib import Path
from django.views.static import serve
from django.urls import re_path

_frontend_images = settings.BASE_DIR.parent / 'frontend' / 'public' / 'downloaded_images'
_root_images = settings.BASE_DIR.parent / 'downloaded_images'
DOWNLOADED_IMAGES_DIR = str(_frontend_images if _frontend_images.exists() else _root_images)

urlpatterns += [
    re_path(r'^downloaded_images/(?P<path>.*)$', serve, {'document_root': DOWNLOADED_IMAGES_DIR}),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
