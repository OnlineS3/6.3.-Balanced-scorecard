from django.conf.urls import url

from . import views

urlpatterns = [
	url(r'^guide/$', views.guide, name='bscapp_guide'),
	url(r'^about/$', views.about, name='bscapp_about'),
	url(r'^access/$', views.access, name='bscapp_access'),
	url(r'^related/$', views.related, name='bscapp_related'),
	url(r'^loginview/$', views.login_view, name='bscapp_loginview'),
	url(r'^logoutview/$', views.logout, name='bscapp_logoutview'),
	url(r'^savetables/$', views.save_tables, name='bscapp_savetables'),
	url(r'^loadtables/$', views.load_tables, name='bscapp_loadtables'),
	url(r'^downloaddata/$', views.download_data, name='bscapp_downloaddata'),
	url(r'^getscorecards/$', views.get_scorecard_for_user, name='bscapp_getscorecards'),
	url(r'^callback/$', views.callback, name='bscapp_callback'),
	url(r'^exporttopdf$', views.export_to_pdf, name='bscapp_exporttopdf'),
	url(r'^$', views.index, name='bscapp_index'),
]