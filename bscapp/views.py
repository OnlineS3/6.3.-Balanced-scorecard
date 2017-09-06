from django.shortcuts import render,redirect
from django.http import HttpResponse, FileResponse
from django.template import loader
from django.contrib.auth import authenticate,login,logout

#UNCOMMENT FOR LINUX
#from weasyprint import HTML, CSS

from .models import tablerow,Scorecard, Observation
import json
import pdfkit

from auth0.v3.authentication import GetToken
from auth0.v3.authentication import Users

from urlparse import urlparse

client_id = "vE0hJ4Gx1uYG9LBtuxgqY7CTIFmKivFH"
client_secret = "Mk-vnlkbSoBxIVJnOTqAqpIh6lH4Kdi2n7H9y9DbaNPfzK8n1s5rTuQv3GmHDKWJ"

def index(request):
	#template = loader.get_template('templates\\index.html')
	return render(request, 'bscapp/index.html')

def guide(request):
	return render(request, 'bscapp/guide.html')

def access(request):
	return render(request, 'bscapp/access_app.html')

def related(request):
	return render(request, 'bscapp/related_documents.html')

def login_view(request):
	'''
	username = request.POST['username']
	password = request.POST['password']
	user = authenticate(request=request, username=username, password=password)
	if user is not None:
		login(request, user)
	context = {'user': request.user}
	'''
	request.session['bscapp_profile'] = json.loads('{"email": "' + request.POST['username'] + '"}')
	return redirect('bscapp_index')

def logout_view(request):
	logout(request)
	return redirect('index')

def save_tables(request):
	text_json = request.POST['tablejson'];
	parsed_json = json.loads(text_json)

	scorecard_name = parsed_json["scorecard_name"]
	if Scorecard.objects.filter(scorecard_name=scorecard_name).count() == 0:
		scorecard_instance = Scorecard.objects.create(user_email=request.session['bscapp_profile']['email'], scorecard_name=scorecard_name)
		scorecard_instance.save()

	#TODO anyone can edit a scorecard if they know the name of it, should filter by name and user...
	
	scorecard = Scorecard.objects.filter(scorecard_name=scorecard_name).first()

	#table index:
	#0 = learngrow
	#1 = customer
	#2 = business
	#3 = financial

        tablerow.objects.filter(scorecard=scorecard).delete()
        
        for row in parsed_json["tables"]["learngrowtable"]["rows"]:
                tablerow_instance = tablerow.objects.create(scorecard=scorecard, table=0, year=row["year"], name=row["name"],
                                                            measure=row["measure"], target=row["target"], actual=row["actual"],
                                                            plan_of_action=row["poa"])
                tablerow_instance.save()

                observation_instance = Observation.objects.create(tablerow=tablerow_instance, value=row["actual"])
                observation_instance.save()

        for row in parsed_json["tables"]["customertable"]["rows"]:
                tablerow_instance = tablerow.objects.create(scorecard=scorecard, table=1, year=row["year"], name=row["name"],
                                                            measure=row["measure"], target=row["target"], actual=row["actual"],
                                                            plan_of_action=row["poa"])
                tablerow_instance.save()

                observation_instance = Observation.objects.create(tablerow=tablerow_instance, value=row["actual"])
                observation_instance.save()

        for row in parsed_json["tables"]["businesstable"]["rows"]:
                tablerow_instance = tablerow.objects.create(scorecard=scorecard, table=2, year=row["year"], name=row["name"],
                                                            measure=row["measure"], target=row["target"], actual=row["actual"],
                                                            plan_of_action=row["poa"])
                tablerow_instance.save()

                observation_instance = Observation.objects.create(tablerow=tablerow_instance, value=row["actual"])
                observation_instance.save()

        for row in parsed_json["tables"]["financialtable"]["rows"]:
                tablerow_instance = tablerow.objects.create(scorecard=scorecard, table=3, year=row["year"], name=row["name"],
                                                            measure=row["measure"], target=row["target"], actual=row["actual"],
                                                            plan_of_action=row["poa"])
                tablerow_instance.save()

                observation_instance = Observation.objects.create(tablerow=tablerow_instance, value=row["actual"])
                observation_instance.save()
        
	#return redirect('index')
	return HttpResponse(text_json)

def load_tables(request):
	scorecard_name = request.POST["scorecard_name"]
	scorecard = Scorecard.objects.filter(scorecard_name=scorecard_name)
	rows = tablerow.objects.filter(scorecard=scorecard)
	learngrow = '"learngrowtable": { "rows": ['
	business = '"businesstable": { "rows": ['
	customer = '"customertable": { "rows": ['
	financial = '"financialtable": { "rows": ['

	for r in rows:
		if r.table == 0:
			learngrow += '{"year": "' + str(r.year) + '", "name": "' + r.name + '", "measure": "' + r.measure + '", "target": "' + r.target + '", "actual": "' + r.actual + '", "poa": "' + r.plan_of_action + '"},'
		elif r.table == 1:
			customer += '{"year": "' + str(r.year) + '", "name": "' + r.name + '", "measure": "' + r.measure + '", "target": "' + r.target + '", "actual": "' + r.actual + '", "poa": "' + r.plan_of_action + '"},'
		elif r.table == 2:
			business += '{"year": "' + str(r.year) + '", "name": "' + r.name + '", "measure": "' + r.measure + '", "target": "' + r.target + '", "actual": "' + r.actual + '", "poa": "' + r.plan_of_action + '"},'
		elif r.table == 3:
			financial += '{"year": "' + str(r.year) + '", "name": "' + r.name + '", "measure": "' + r.measure + '", "target": "' + r.target + '", "actual": "' + r.actual + '", "poa": "' + r.plan_of_action + '"},'

	if learngrow.endswith(","):
		learngrow = learngrow[:len(learngrow)-1]
	if business.endswith(","):
		business = business[:len(business)-1]
	if customer.endswith(","):
		customer = customer[:len(customer)-1]
	if financial.endswith(","):
		financial = financial[:len(financial)-1]

	learngrow += "]},"
	business += "]},"
	customer += "]},"
	financial += "]}"

	json = '{"tables":{'+ learngrow + business + customer + financial +'}}'

	return HttpResponse(json)

def get_scorecard_for_user(request):
	scorecards = Scorecard.objects.filter(user_email=request.session['bscapp_profile']['email'])
	scorecards_json = '{"scorecards":['

	for sc in scorecards:
		scorecards_json += '{"scorecard_name": "'+ sc.scorecard_name +'"},'

	if scorecards_json.endswith(","):
		scorecards_json = scorecards_json[:len(scorecards_json)-1]

	scorecards_json += ']}'
	return HttpResponse(scorecards_json)


def download_data(request):
	json_string = request.POST['tablejson']
	response = FileResponse(json_string, content_type='application/json')
	response['Content-Disposition'] = 'attachment; filename=balanced_scorecard.json'
	print 'in download data'
	return response

def export_to_pdf(request):
	#FOR LINUX
	#pdf = HTML(string=request.POST['html_string']).write_pdf(stylesheets=[CSS(filename="/home/django/balancedscorecard/bscapp/static/css/bscs.css"), CSS(filename="/home/django/balancedscorecard/bscapp/static/css/layout.css")])
	#return FileResponse(pdf, content_type='application/pdf')

	#FOR WINDOWS
	html_string = request.POST['html_string']
	config = pdfkit.configuration(wkhtmltopdf='C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe')
	css = [
		'C:\\Users\\Joel Potts\\PycharmProjects\\onlines3_django\\bscapp\\static\\css\\bsc.css',
		'C:\\Users\\Joel Potts\\PycharmProjects\\onlines3_django\\cvbapp\\static\\css\\layout.css',
	]
	pdf = pdfkit.from_string(html_string, False, configuration=config, css=css)
	response = FileResponse(pdf, content_type='application/pdf')
	response['Content-Disposition'] = 'attachment; filename=balanced_scorecard.pdf'
	return response

def callback(request):
	code = request.GET['code']
	get_token = GetToken('onlines3.eu.auth0.com')
	auth0_users = Users('onlines3.eu.auth0.com')
	token = get_token.authorization_code(client_id, client_secret, code, 'http://li1088-54.members.linode.com:8082/bscapp/callback/')
	user_info = auth0_users.userinfo(token['access_token'])
	request.session['bscapp_profile'] = json.loads(user_info)
	#save user to db and session
	return redirect('bscapp_index')

def logout(request):
	request.session['bscapp_profile'] = None
	#parsed_base_url = urlparse('http://li1088-54.members.linode.com:8082/bscapp/callback/')
	#base_url = parsed_base_url.scheme + '://' + parsed_base_url.netloc
	#return redirect('https://%s/v2/logout?returnTo=%s&client_id=%s' % ('onlines3.eu.auth0.com', base_url, 'vE0hJ4Gx1uYG9LBtuxgqY7CTIFmKivFH'))
	return redirect('bscapp_index')
